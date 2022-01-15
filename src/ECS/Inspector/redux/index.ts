import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { ComponentManager } from 'ECS'

export type Components = ReturnType<ComponentManager['getComponentsSerialized']>

interface InspectorState {
    entities: string[],
    components: Components,
}

export interface State {
    inspector: InspectorState,
}

const initialState = {
    entities: [],
    components: [],
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
    },
})

export const { actions, reducer } = inspector
export * as selectors from './selectors'
