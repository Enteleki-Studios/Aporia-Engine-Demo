import type { Optional } from '../definitions'
import type { FunctionSystem } from './System'

export { ECS, type ECSStatsType } from './ECS'
export { ECSFilter } from './ECSFilter'
export { Entity, type EntityId } from './Entity'
export { Component } from './Component'
export { type System } from './System'
export { createComponent } from './createComponent'

type PrepareSystem<T = void> = (options: T) => Optional<FunctionSystem, 'label'>

export const createSystem = <T = void>(label: string, prepareSystem: PrepareSystem<T>) => {
    const systemCreator = (options: T): FunctionSystem => {
        const system = prepareSystem(options)
        system.toString = () => label
        system.label = label
        return system as FunctionSystem
    }

    return systemCreator
}
