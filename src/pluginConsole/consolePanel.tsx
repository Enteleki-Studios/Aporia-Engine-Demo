import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Panel } from '@inspector'
import { CaretDoubleRightIcon } from '@phosphor-icons/react'

import './consolePanel.scss'

type Log = {
    timestamp: number
    severity: string
    content: string
}

const OVERRIDE_METHODS = ['log', 'info', 'warn', 'error', 'debug'] as const

export const ConsolePanel = () => {
    const [logs, setLogs] = useState<Log[]>([])
    const logsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        OVERRIDE_METHODS.forEach((method) => {
            const original = window.console[method]
            window.console[method] = (...args) => {
                original(...args)

                setLogs((prev) => [
                    ...prev,
                    {
                        timestamp: Date.now(),
                        severity: method,
                        content: args.map((a) => a.toString()).join(' '),
                    },
                ])
            }
        })
    }, [])

    useLayoutEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight
        }
    }, [logs])

    return (
        <Panel className="Console">
            <div className="log" ref={logsRef}>
                {logs.map((log, i) => (
                    <div key={i} className={`logLine ${log.severity}`}>
                        {log.timestamp} {log.content}
                    </div>
                ))}
            </div>
            <div className="inputWrapper">
                <CaretDoubleRightIcon />
                <input type="text" />
            </div>
        </Panel>
    )
}
