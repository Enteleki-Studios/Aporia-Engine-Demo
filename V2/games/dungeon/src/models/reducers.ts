import { slice as inspectorSlice } from '@gengine/inspector'
import { combineReducers, createSlice } from '@reduxjs/toolkit'

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
