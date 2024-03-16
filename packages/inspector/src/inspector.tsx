import React, { FormEvent, useCallback, useEffect, useState, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    GameController,
    Play,
    SkipForward,
    Pause,
    X,
    IconContext,
    SquareSplitHorizontal,
    NumberSquareOne,
    NumberSquareTwo,
} from '@phosphor-icons/react'

import { DebugMode, DebugModes, ENGINE_VERSION, useWorld } from '@gengine/core'

import { EntityExplorer } from 'entityExplorer'
import { DebugView } from 'debugView'
import { setDebugMode, getDebugMode } from './slice'
import { Icon } from './Icon'
import { WorldStats } from './WorldStats'

import './style.scss'

type InspectorProps = {
    children: ReactNode
    startOpen?: boolean
}

export const Inspector = ({ children, startOpen }: InspectorProps) => {
    const dispatch = useDispatch()
    const debugMode = useSelector(getDebugMode)
    const world = useWorld()

    const [isPassthroughMode, setIsPassthroughMode] = useState(!startOpen)
    const [isGameViewVisible, setIsGameViewVisible] = useState(true)
    const [isDebugViewVisible, setIsDebugViewVisible] = useState(false)

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

    return (
        <IconContext.Provider
            value={{
                size: 18,
                weight: 'fill',
                color: '#ffffff',
            }}
        >
            <div className="Inspector">
                <div className="header">
                    <div className="title">
                        <Icon icon={<GameController />} />
                        Inspector
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
                            icon={<Pause />}
                            onClick={() => world?.stop()}
                            title="Stop world"
                        />
                    </div>
                    <div className="toolbar views">
                        <Icon
                            icon={<NumberSquareOne weight="regular" size="20" />}
                            onClick={() => {
                                setIsGameViewVisible(true)
                                setIsDebugViewVisible(false)
                            }}
                            title="Game view"
                            disabled={isGameViewVisible && !isDebugViewVisible}
                        />
                        <Icon
                            icon={<NumberSquareTwo weight="regular" size="20" />}
                            onClick={() => {
                                setIsDebugViewVisible(true)
                                setIsGameViewVisible(false)
                            }}
                            title="Debug view"
                            disabled={isDebugViewVisible && !isGameViewVisible}
                        />
                        <Icon
                            icon={<SquareSplitHorizontal weight="regular" size="22" />}
                            onClick={() => {
                                setIsGameViewVisible(true)
                                setIsDebugViewVisible(true)
                            }}
                            title="Split view"
                            disabled={isGameViewVisible && isDebugViewVisible}
                        />
                    </div>
                    <Icon
                        icon={<X weight="regular" />}
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
                <div className="gameViewsContainer">
                    {isGameViewVisible && <div className="game">{children}</div>}
                    {isDebugViewVisible && (
                        <div className="gameDebug">
                            <DebugView />
                        </div>
                    )}
                </div>
                <footer>version: {ENGINE_VERSION} | Enteleki Studios</footer>
            </div>
        </IconContext.Provider>
    )
}
