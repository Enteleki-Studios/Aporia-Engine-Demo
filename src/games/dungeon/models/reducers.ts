import { createSlice, combineReducers } from '@reduxjs/toolkit'
import { reducer as inspector } from 'gengine/Inspector/redux'

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
    inspector,
})
