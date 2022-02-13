import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { Inspector } from 'gengine'
import { ZombieHorde } from 'zombieHorde'

import store from 'store'

import UI from 'UI'

const zombieHorde = new ZombieHorde()
zombieHorde.ecs.addStore(store)

render(
    <Provider store={store}>
        <Inspector>
            <UI zombieHorde={zombieHorde} />
        </Inspector>
    </Provider>,
    document.getElementById('Root'),
)
