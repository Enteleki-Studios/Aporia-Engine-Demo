import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { ComponentManager, DebugMode } from 'gengine'

export type Components = ReturnType<ComponentManager['getComponentsInspected']>

interface InspectorState {
    entities: string[],
    components: Components,
    debugMode: DebugMode,
}

export interface State {
    inspector: InspectorState,
}

const initialState = {
    entities: [],
    components: [],
    debugMode: 'game',
} as InspectorState

const inspector = createSlice({
    name: 'inspector',
    initialState,
    reducers: {
        updateEntities(state, action: PayloadAction<string[]>) {
            state.entities = action.payload
        },
        updateComponents(state, action: PayloadAction<Components>) {
            state.components = action.payload
        },
        setDebugMode(state, action: PayloadAction<DebugMode>) {
            state.debugMode = action.payload
        },
    },
})

export const { actions, reducer } = inspector
export * as selectors from './selectors'
