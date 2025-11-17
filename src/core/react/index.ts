import { createContext } from 'react'

import { Runtime } from '@core'

export { useRenderSync } from './useRenderSync'
export { useSmoothNumber } from './useSmoothNumber'
export { useWorld, type TypedUseWorld } from './useWorld'

export * from './runtimePanel'
export * from './resourcesPanel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export const WorldContext = createContext<Runtime<any> | undefined>(undefined)
