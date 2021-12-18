import * as React from 'react'
import { render } from 'react-dom'

import { Inspector } from 'ECS'

import UI from 'UI'

import './root.scss'

render(
    <Inspector>
        <UI />
    </Inspector>
, document.getElementById('Root'))
