import { createSlice, combineReducers } from '@reduxjs/toolkit'
import { inspector } from 'gengine'

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
    inspector: inspector.slice.reducer,
})
