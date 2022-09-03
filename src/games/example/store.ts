import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import { rootReducer } from 'models/reducers'

import { middleware as exampleMiddleware } from './example'

export const store = configureStore({
    reducer: rootReducer,
    middleware: [
        exampleMiddleware,
        logger,
    ],
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
