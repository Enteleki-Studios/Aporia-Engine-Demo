import React, { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setDebugMode, getDebugMode } from './slice'

import './index.scss'
import { DebugMode } from '../constants'

export const InspectorUI = () => {
    const dispatch = useDispatch()
    const debugMode = useSelector(getDebugMode)

    const onModeChange = (e: FormEvent<HTMLInputElement>) => {
        dispatch(setDebugMode(e.currentTarget.value as DebugMode))
    }

    return (
        <div className="Inspector">
            <div className="window">
                <div className="header">Inspector</div>
                <div className="body">
                    <div>Mode:</div>
                    <div>
                        <form>
                            <label>
                                <input
                                    type="radio"
                                    value="game"
                                    name="mode"
                                    onChange={onModeChange}
                                    checked={debugMode === 'game'}
                                />
                                Game
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="debug"
                                    name="mode"
                                    onChange={onModeChange}
                                    checked={debugMode === 'debug'}
                                />
                                Debug
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="sideBySide"
                                    name="mode"
                                    onChange={onModeChange}
                                    checked={debugMode === 'sideBySide'}
                                />
                                Side by side
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
