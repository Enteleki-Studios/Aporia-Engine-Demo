import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DebugMode } from 'gengine'

export type LogLine = {
    ts: number,
    message: string,
}

type LogLineNumbered = LogLine & { lineNumber: number }

interface InspectorState {
    debugMode: DebugMode
    log: LogLineNumbered[]
}

interface State {
    inspector: InspectorState
}

const initialState: InspectorState = {
    debugMode: 'game',
    log: [],
}

export const slice = createSlice({
    name: 'inspector',
    initialState,
    reducers: {
        setDebugMode(state, action: PayloadAction<DebugMode>) {
            state.debugMode = action.payload
        },
        appendLog(state, action: PayloadAction<LogLine>) {
            state.log.push({
                ...action.payload,
                lineNumber: ((state.log[state.log.length - 1]?.lineNumber) || 0) + 1,
            })
        },
    },
})

export const { setDebugMode, appendLog } = slice.actions

export const getDebugMode = (state: State) => state.inspector.debugMode
export const getLog = (state: State) => state.inspector.log
