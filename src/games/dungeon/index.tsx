import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// import { Inspector } from 'gengine'

import store from 'dungeon/store'
import UI from 'dungeon/UI'

import './root.scss'

// render(
//     <Provider store={store}>
//         <Inspector>
//             <UI dungeon={dungeon} />
//         </Inspector>
//     </Provider>,
//     document.getElementById('Root'),
// )

const root = createRoot(document.getElementById('Root') as Element)

root.render(
    <Provider store={store}>
        <UI />
    </Provider>,
)
