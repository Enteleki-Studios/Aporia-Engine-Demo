import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DebugMode } from 'gengine'

interface InspectorState {
    debugMode: DebugMode,
}

export interface State {
    inspector: InspectorState,
}

const initialState = {
    debugMode: 'game',
} as InspectorState

export const slice = createSlice({
    name: 'inspector',
    initialState,
    reducers: {
        setDebugMode(state, action: PayloadAction<DebugMode>) {
            state.debugMode = action.payload
        },
    },
})

export const { setDebugMode } = slice.actions

export const getDebugMode = (state: State) => state.inspector.debugMode
