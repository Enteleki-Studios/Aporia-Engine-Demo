import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InspectorState {
    entities: string[],
}

interface State {
    inspector: InspectorState,
}

const initialState = {
    entities: [],
} as InspectorState

const inspector = createSlice({
    name: 'inspector',
    initialState,
    reducers: {
        updateEntities(state, action: PayloadAction<string[]>) {
            state.entities = action.payload
        },
    },
})

export const selectors = {
    getEntities(state: State) {
        return state.inspector.entities
    },
}

export const { actions, reducer } = inspector
