import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { DebugMode } from '..'

type InspectorState = {
    debugMode: DebugMode
}

type State = {
    inspector: InspectorState
}

const initialState: InspectorState = {
    debugMode: 'game',
}

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
