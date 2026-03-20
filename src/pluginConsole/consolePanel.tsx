import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'

import type { PluginsToResources } from '@core'

import { type TypedUseWorld, useWorld } from '@core/react'

import { Panel } from '@inspector'
import { CaretDoubleRightIcon } from '@phosphor-icons/react'

import './consolePanel.scss'
import type { PluginConsole } from './plugin'

export const useConsoleWorld: TypedUseWorld<PluginsToResources<[PluginConsole]>> =
    useWorld

export const ConsolePanel = () => {
    const world = useConsoleWorld()
    const { hermit } = world.console

    const logsRef = useRef<HTMLDivElement>(null)

    const log = useSyncExternalStore(hermit.subscribe, hermit.getLog)

    useLayoutEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight
        }
    })

    return (
        <Panel className="Console">
            <div className="log" ref={logsRef}>
                {log.map((entry, i) => (
                    <div key={i} className={`logLine ${entry.severity}`}>
                        {entry.content}
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
