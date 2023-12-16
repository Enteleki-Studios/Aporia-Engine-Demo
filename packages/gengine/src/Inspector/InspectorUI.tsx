import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PiGameControllerFill, PiPlayFill, PiSkipForwardFill, PiStopFill } from 'react-icons/pi'

import type { World } from 'core'
import { DebugMode, DebugModes, ENGINE_VERSION } from 'definitions'

import { setDebugMode, getDebugMode } from './slice'
import { Icon } from './Icon'
import { WorldStats } from './WorldStats'

import './style.scss'
type InspectorUIProps = {
    getWorld: () => World
}

export const InspectorUI = ({ getWorld }: InspectorUIProps) => {
    const dispatch = useDispatch()
    const debugMode = useSelector(getDebugMode)
    const world = getWorld()

    const [status, setStatus] = useState('')

    const updateStatus = useCallback(() => {
        setStatus(world.isRunning ? 'running' : 'stopped')
    }, [world])

    useEffect(() => {
        world.addEventListener('start', updateStatus)
        world.addEventListener('stop', updateStatus)

        updateStatus()

        return () => {
            world.removeEventListener('start', updateStatus)
            world.removeEventListener('stop', updateStatus)
        }
    }, [updateStatus, world])

    const onModeChange = (e: FormEvent<HTMLSelectElement>) => {
        dispatch(setDebugMode(e.currentTarget.value as DebugMode))
    }

    const title = `Gengine - ${status}`

    return (
        <div className="Inspector">
            <div className="window">
                <div className="header">
                    <div className="title">
                        <Icon icon={<PiGameControllerFill />} />
                        {title}
                    </div>
                    <div className="toolbar">
                        <Icon disabled={world.isRunning} icon={<PiPlayFill />} onClick={() => world.start()} title="Start world" />
                        <Icon disabled={world.isRunning} icon={<PiSkipForwardFill />} onClick={() => world.step()} title="Play one frame" />
                        <Icon disabled={!world.isRunning} icon={<PiStopFill />} onClick={() => world.stop()} title="Stop world" />
                    </div>
                </div>
                <div className="body">
                    <WorldStats world={world} />
                    <section>
                        <h3>Settings</h3>
                        <label>
                            View mode:
                            <select value={debugMode} onChange={onModeChange}>
                                {DebugModes.map((mode) => (
                                    <option key={mode.label} value={mode.value}>
                                        {mode.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </section>
                </div>
                <div className="version">{ENGINE_VERSION}</div>
            </div>
        </div>
    )
}
