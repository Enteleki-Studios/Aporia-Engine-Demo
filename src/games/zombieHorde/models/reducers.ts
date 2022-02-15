import { createSlice, combineReducers } from '@reduxjs/toolkit'
import { inspectorReducer } from 'gengine'

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

export default combineReducers({
    health: health.reducer,
    inspectorReducer,
})
