import { objectEntries, recordFromArray } from '@core/utils'

import { type Utility } from '@hermitShell'

import { parseArgs } from './parseArgs'

const OVERRIDE_METHODS = ['log', 'info', 'warn', 'error', 'debug'] as const
type MethodName = (typeof OVERRIDE_METHODS)[number]

type Callback = () => void

type LogEntry = {
    timestamp: number
    severity: string
    content: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Matches js console
type ConsoleMethod = (...data: any[]) => void

// TODO: Serve only last X entries to react

export class Hermit {
    private log: LogEntry[] = []
    private observers = new Set<Callback>()
    private originalConsoleMethods: Record<MethodName, ConsoleMethod | null> =
        recordFromArray(OVERRIDE_METHODS, () => null)
    private utilities = new Map<string, Utility[1]>()

    private onUpdate() {
        this.observers.forEach((cb) => {
            cb()
        })
    }

    addUtility(utility: Utility) {
        this.utilities.set(utility[0], utility[1])
    }

    eval(input: string) {
        return new Promise<void>((resolve) => {
            this.newEntry(input, 'input')

            const args = parseArgs(input)
            if (args[0]) {
                const utility = this.utilities.get(args[0])
                if (utility) {
                    const result = utility(args)
                    this.newEntry(result, 'result')
                } else {
                    this.newEntry(`Utility not found: ${args[0]}`, 'error')
                }
            } else {
                this.newEntry('No args parsed', 'error')
            }
            resolve()
        })
    }

    newEntry(content: string | undefined, severity?: string) {
        this.log = [
            ...this.log,
            {
                timestamp: Date.now(),
                severity: severity ?? 'log',
                content: content ?? 'undefined',
            },
        ]
        this.onUpdate()
    }

    interceptConsole() {
        OVERRIDE_METHODS.forEach((method) => {
            this.originalConsoleMethods[method] = window.console[method]

            window.console[method] = (...args) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Follows the args type for console
                this.originalConsoleMethods[method]?.(...args)

                const content = args
                    .map((a: unknown) => {
                        if (a === null) {
                            return 'null'
                        }
                        if (a === undefined) {
                            return 'undefined'
                        }
                        if (typeof a === 'string') {
                            return a
                        }
                        if (typeof a === 'number') {
                            return a.toString()
                        }
                        return JSON.stringify(a)
                    })
                    .join(' ')
                this.newEntry(content, method)
            }
        })
    }

    releaseConsole() {
        objectEntries(this.originalConsoleMethods).forEach(
            ([methodName, originalMethod]) => {
                if (originalMethod) {
                    window.console[methodName] = originalMethod
                }
            },
        )
    }

    getLog = () => {
        return this.log
    }

    subscribe = (cb: Callback) => {
        this.observers.add(cb)

        return () => {
            this.observers.delete(cb)
        }
    }
}
