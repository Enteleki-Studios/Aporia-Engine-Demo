import { createContext, useContext } from 'react'

import { World } from '~/core'

export const WorldContext = createContext<World | null>(null)
export const useWorld = () => useContext(WorldContext)
