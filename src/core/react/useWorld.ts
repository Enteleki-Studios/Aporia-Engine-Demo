import { useContext } from 'react'

import { WorldContext } from '.'

export const useWorld = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- World<any> is intentional for generic hook
    const context = useContext(WorldContext)

    if (!context) {
        throw new Error(
            'useWorld must be used within a WorldContext provider with a valid Runtime',
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- World<any> is intentional for generic hook
    return context
}

export type TypedUseWorld<E> = () => E
