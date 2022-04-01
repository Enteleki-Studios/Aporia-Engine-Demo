import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

// import { Inspector } from 'gengine'

import dungeon from 'dungeon/dungeon'
import store from 'dungeon/store'
import UI from 'dungeon/UI'

import './root.scss'

dungeon.ecs.addStore(store)

// render(
//     <Provider store={store}>
//         <Inspector>
//             <UI dungeon={dungeon} />
//         </Inspector>
//     </Provider>,
//     document.getElementById('Root'),
// )

render(
    <Provider store={store}>
        <UI />
    </Provider>,
    document.getElementById('Root'),
)
