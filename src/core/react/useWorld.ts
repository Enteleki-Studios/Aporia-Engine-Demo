import { useContext } from 'react'

import { WorldContext } from '.'

export const useWorld = () => {
    const context = useContext(WorldContext)

    if (!context) {
        throw new Error(
            'useWorld must be used within a WorldContext provider with a valid Runtime',
        )
    }

    return context
}

export type TypedUseWorld<E> = () => E
