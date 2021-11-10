import * as React from 'react'
import { render } from 'react-dom'

import Dungeon from 'Dungeon'

const canvas = document.getElementById('WebGLCanvas')
Dungeon(canvas)

render(<div>Hey</div>, document.getElementById('debug'))
