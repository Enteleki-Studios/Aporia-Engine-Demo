import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { Inspector } from 'ECS'

import store from 'store'

import UI from 'UI'

import './root.scss'

render(
    <Provider store={store}>
        <Inspector>
            <UI />
        </Inspector>
    </Provider>,
    document.getElementById('Root'),
)
