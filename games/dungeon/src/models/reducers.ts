import { combineReducers, createSlice } from '@reduxjs/toolkit'

import { slice as inspectorSlice } from '@gengine/inspector'

const health = createSlice({
    name: 'health',
    initialState: {
        value: 20,
    },
    reducers: {
        increment: (state) => {
            state.value += 1
        },
    },
})

export const rootReducer = combineReducers({
    health: health.reducer,
    inspector: inspectorSlice.reducer,
})
