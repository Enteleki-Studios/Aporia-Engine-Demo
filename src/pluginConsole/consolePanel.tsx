import {
    ChangeEvent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react'

import type { PluginsToResources } from '@enteleki-studios/aporia-engine-core'
import { type TypedUseWorld, useWorld } from '@enteleki-studios/aporia-engine-core/react'
import { Panel } from '@inspector'
import { CaretDoubleRightIcon } from '@phosphor-icons/react'

import './consolePanel.scss'
import { kindToIcon } from './kindToIcon'
import type { PluginConsole } from './plugin'

export const useConsoleWorld: TypedUseWorld<PluginsToResources<[PluginConsole]>> =
    useWorld

export const ConsolePanel = () => {
    const world = useConsoleWorld()
    const { hermit } = world.console
    const log = useSyncExternalStore(hermit.subscribe, hermit.getLog)
    const logsRef = useRef<HTMLDivElement>(null)

    const [input, setInput] = useState('')

    const handleInputKeydown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                setInput((prev) => {
                    if (prev.length) {
                        void hermit.eval(prev)
                    }
                    return ''
                })
            }
        },
        [hermit],
    )

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.currentTarget.value)
    }, [])

    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight
        }
    })

    return (
        <Panel className="Console">
            <div className="log" ref={logsRef}>
                <div className="logContents">
                    {log.map((entry) => (
                        <div key={entry.id} className={`logLine ${entry.severity}`}>
                            <div className="kind">{kindToIcon(entry.severity)}</div>
                            <div className="content">{entry.content}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="inputWrapper">
                <CaretDoubleRightIcon />
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeydown}
                />
            </div>
        </Panel>
    )
}
