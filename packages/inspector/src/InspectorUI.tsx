import React, { FormEvent, useCallback, useEffect, useState, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GameController, Play, SkipForward, Stop, X, IconContext } from '@phosphor-icons/react'

import { DebugMode, DebugModes, ENGINE_VERSION, useWorld } from '@gengine/core'

import { EntityExplorer } from 'entityExplorer'
import { setDebugMode, getDebugMode } from './slice'
import { Icon } from './Icon'
import { WorldStats } from './WorldStats'

import './style.scss'

type InspectorUIProps = {
    children: ReactNode
    passthroughOff?: boolean
}

export const InspectorUI = ({ children, passthroughOff }: InspectorUIProps) => {
    const dispatch = useDispatch()
    const debugMode = useSelector(getDebugMode)
    const world = useWorld()

    const [isPassthroughMode, setIsPassthroughMode] = useState(!passthroughOff)

    const [status, setStatus] = useState('')

    const updateStatus = useCallback(() => {
        if (world) {
            setStatus(world.isRunning ? 'running' : 'stopped')
        } else {
            setStatus('no world')
        }
    }, [world])

    useEffect(() => {
        if (world) {
            world.addEventListener('start', updateStatus)
            world.addEventListener('stop', updateStatus)

            updateStatus()

            return () => {
                world.removeEventListener('start', updateStatus)
                world.removeEventListener('stop', updateStatus)
            }
        }
    }, [updateStatus, world])

    useEffect(() => {
        const togglePassthroughMode = (event: KeyboardEvent) => {
            if (event.code === 'Backquote') {
                setIsPassthroughMode(!isPassthroughMode)
            }
        }
        document.addEventListener('keydown', togglePassthroughMode)

        return () => {
            document.removeEventListener('keydown', togglePassthroughMode)
        }
    }, [isPassthroughMode, setIsPassthroughMode])

    const onModeChange = (e: FormEvent<HTMLSelectElement>) => {
        dispatch(setDebugMode(e.currentTarget.value as DebugMode))
    }

    if (isPassthroughMode) {
        return children
    }

    const title = `Inspector | Engine: ${status}`

    return (
        <IconContext.Provider value={{
            size: 18,
            weight: 'fill',
            color: '#ffffff',
        }}>
            <div className="Inspector">
                <div className="header">
                    <div className="title">
                        <Icon icon={<GameController />} />
                        {title}
                    </div>
                    <div className="toolbar">
                        <Icon
                            disabled={world?.isRunning}
                            icon={<Play />}
                            onClick={() => world?.start()}
                            title="Start world"
                        />
                        <Icon
                            disabled={world?.isRunning}
                            icon={<SkipForward />}
                            onClick={() => world?.step()}
                            title="Play one frame"
                        />
                        <Icon
                            disabled={!world?.isRunning}
                            icon={<Stop />}
                            onClick={() => world?.stop()}
                            title="Stop world"
                        />
                    </div>
                    <Icon
                        icon={<X />}
                        onClick={() => setIsPassthroughMode(true)}
                        title="Close inspector"
                    />
                </div>
                <div className="window">
                    <div className="body">
                        {world && <WorldStats world={world} />}
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
                </div>
                <div className="explorer">
                    <div className="tabs">
                        <button>Entity explorer</button>
                    </div>
                    <div className="toolContainer">
                        <EntityExplorer />
                    </div>
                </div>
                <div className="game">
                    {children}
                </div>
                <footer>
                    version: {ENGINE_VERSION} | Enteleki Studios
                </footer>
            </div>
        </IconContext.Provider>
    )
}
