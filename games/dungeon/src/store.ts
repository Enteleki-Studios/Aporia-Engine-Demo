import { configureStore } from '@reduxjs/toolkit'
// import logger from 'redux-logger'

import { rootReducer } from 'models/reducers'

// import { middleware as dungeonMiddleware } from './dungeon'

export const store = configureStore({
    reducer: rootReducer,
    middleware: [
        // dungeonMiddleware,
        // logger,
    ],
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
