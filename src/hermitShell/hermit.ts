import { objectEntries, recordFromArray } from '@core/utils'

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

    private onUpdate() {
        this.observers.forEach((cb) => {
            cb()
        })
    }

    interceptConsole() {
        OVERRIDE_METHODS.forEach((method) => {
            this.originalConsoleMethods[method] = window.console[method]

            window.console[method] = (...args) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Follows the args type for console
                this.originalConsoleMethods[method]?.(...args)

                this.log = [
                    ...this.log,
                    {
                        timestamp: Date.now(),
                        severity: method,
                        content: args
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
                            .join(' '),
                    },
                ]

                this.onUpdate()
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
