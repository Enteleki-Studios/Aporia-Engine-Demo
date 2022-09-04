import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { inspector, WorldContext } from 'gengine'

import { world } from './darkfps'
import { store } from './store'
import DarkUI from './darkUI'

import './style.scss'

const root = createRoot(document.getElementById('Root') as Element)

root.render(
    <Provider store={store}>
        <WorldContext.Provider value={world}>
            <inspector.InspectorUI />
            <DarkUI />
        </WorldContext.Provider>
    </Provider>,
)
