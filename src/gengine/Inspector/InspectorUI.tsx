import React, { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setDebugMode, getDebugMode } from './slice'

import './style.scss'
import { DebugMode, DebugModes } from '../constants'
import { WorldStats } from './WorldStats'

export const InspectorUI = () => {
    const dispatch = useDispatch()
    const debugMode = useSelector(getDebugMode)

    const onModeChange = (e: FormEvent<HTMLSelectElement>) => {
        dispatch(setDebugMode(e.currentTarget.value as DebugMode))
    }

    return (
        <div className="Inspector">
            <div className="window">
                <div className="header">Inspector</div>
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
            </div>
        </div>
    )
}
