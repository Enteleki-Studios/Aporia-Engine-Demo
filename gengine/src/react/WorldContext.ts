import { createContext } from 'react'

import { World } from '../World'

export const WorldContext = createContext(new World())
