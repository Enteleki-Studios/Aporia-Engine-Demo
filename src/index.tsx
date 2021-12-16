import * as React from 'react'
import { render } from 'react-dom'

import { Inspector } from 'ECS'

import Dungeon from 'Dungeon'

import './root.scss'

const dungeon: Dungeon = new Dungeon()

render(<Inspector dungeon={dungeon} />, document.getElementById('Root'))
