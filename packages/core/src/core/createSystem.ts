import type { World } from 'core'

import type { Optional } from '../definitions'

export type System = {
    (world: World): void
    label: string
}

type PrepareSystem<T = void> = (options: T) => Optional<System, 'label'>

export const createSystem = <T = void>(label: string, prepareSystem: PrepareSystem<T>) => {
    const systemCreator = (options: T): System => {
        const system = prepareSystem(options)
        system.toString = () => label
        system.label = label
        return system as System
    }

    return systemCreator
}
