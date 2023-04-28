import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { inspector } from 'gengine'

import { world } from './dungeon'
import { store } from './store'
import UI from './UI'

import './root.scss'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(
        <Provider store={store}>
            <inspector.InspectorUI getWorld={() => world} />
            <UI />
        </Provider>,
    )
}
