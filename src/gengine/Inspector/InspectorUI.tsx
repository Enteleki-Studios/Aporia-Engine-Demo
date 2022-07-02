import React, { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setDebugMode, getDebugMode } from './slice'

import './style.scss'
import { DebugMode, DebugModes } from '../constants'

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
                    <label>
                        View mode:
                        <select value={debugMode} onChange={onModeChange}>
                            {DebugModes.map((mode) => (
                                <option value={mode.value}>{mode.label}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    )
}
