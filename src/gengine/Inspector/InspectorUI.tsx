import React, { FormEvent, useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setDebugMode, getDebugMode } from './slice'

import { Icon } from './Icon'
import { DebugMode, DebugModes } from '../constants'
import { WorldStats } from './WorldStats'
import { WorldContext } from '../react/WorldContext'

import './style.scss'

export const InspectorUI = () => {
    const dispatch = useDispatch()
    const debugMode = useSelector(getDebugMode)
    const world = useContext(WorldContext)

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
                        {title}
                    </div>
                    <div className="toolbar">
                        <Icon code="play" onClick={() => world.start()} title="Start world" />
                        <Icon code="step" onClick={() => world.step()} title="Play one frame" />
                        <Icon code="stop" onClick={() => world.stop()} title="Stop world" />
                    </div>
                </div>
                <div className="body">
                    <WorldStats />
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
                <div className="version">
                    {ENGINE_VERSION}
                </div>
            </div>
        </div>
    )
}
