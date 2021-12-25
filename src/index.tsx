import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { Inspector } from 'ECS'
import Dungeon from 'Dungeon'

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
