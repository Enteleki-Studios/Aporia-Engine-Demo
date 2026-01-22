import { createContext } from 'react'

import { type World } from '@core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export const WorldContext = createContext<World<any> | undefined>(undefined)
