import { createContext } from 'react'

import { Runtime } from '@core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export const WorldContext = createContext<Runtime<any> | undefined>(undefined)
