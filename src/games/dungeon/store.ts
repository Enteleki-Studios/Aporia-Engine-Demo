import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import reducer from 'models/reducers'

const store = configureStore({
    reducer,
    middleware: [logger],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
