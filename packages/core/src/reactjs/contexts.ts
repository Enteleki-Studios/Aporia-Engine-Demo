import { World } from 'core'
import { createContext, useContext } from 'react'

export const WorldContext = createContext<World | null>(null)
export const useWorld = () => useContext(WorldContext)
