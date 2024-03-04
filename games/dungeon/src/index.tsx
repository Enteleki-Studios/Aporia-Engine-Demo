import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { WorldContext } from '@gengine/core'
import { InspectorUI } from '@gengine/inspector'

import { world } from './dungeon'
import { store } from './store'
import UI from './UI'

import './root.scss'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(
        <Provider store={store}>
            <WorldContext.Provider value={world}>
                <InspectorUI passthroughOff>
                    <UI />
                </InspectorUI>
            </WorldContext.Provider>
        </Provider>,
    )
}
