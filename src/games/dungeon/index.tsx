import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { Inspector } from 'gengine'
import { Dungeon } from 'dungeon'

import store from 'store'

import UI from 'UI'

import './root.scss'

const dungeon: Dungeon = new Dungeon()
dungeon.ecs.addStore(store)

render(
    <Provider store={store}>
        <Inspector>
            <UI dungeon={dungeon} />
        </Inspector>
    </Provider>,
    document.getElementById('Root'),
)

// render(
//     <Provider store={store}>
//         <UI dungeon={dungeon} />
//     </Provider>,
//     document.getElementById('Root'),
// )
