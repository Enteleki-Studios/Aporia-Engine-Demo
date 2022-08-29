import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { inspector, WorldContext } from 'gengine'

import { world } from 'dungeon/dungeon'
import { store } from 'dungeon/store'
import UI from 'dungeon/UI'

import './root.scss'

const root = createRoot(document.getElementById('Root') as Element)

// root.render(
//     <Provider store={store}>
//         <UI />
//     </Provider>,
// )

root.render(
    <Provider store={store}>
        <WorldContext.Provider value={world}>
            <inspector.InspectorUI />
            <UI />
        </WorldContext.Provider>
    </Provider>,
)
