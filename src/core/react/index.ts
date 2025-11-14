import { createContext, useContext } from 'react'

import { Runtime } from '@core'

export { useSmoothNumber } from './useSmoothNumber'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export const WorldContext = createContext<Runtime<any> | undefined>(undefined)

export const useWorld = () => {
    const context = useContext(WorldContext)

    if (context === undefined) {
        throw new Error(
            'useWorld must be used within a WorldContext provider with a valid Runtime',
        )
    }

    return context
}

export type TypedUseWorld<E> = () => E
