import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { inspector, WorldContext } from 'gengine'

import { world } from './dungeon'
import { store } from './store'
import UI from './UI'

import './root.scss'

createRoot(document.body).render(
    <Provider store={store}>
        <WorldContext.Provider value={world}>
            <inspector.InspectorUI />
            <UI />
        </WorldContext.Provider>
    </Provider>,
)
