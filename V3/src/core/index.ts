import type { Runtime } from './runtime'

export { createDefaultComposer, type DefaultResources } from './pluginComposer'
export { Runtime } from './runtime'
export { createComponent } from './createComponent'
export { pluginClock } from './pluginClock'
export { pluginThree } from './pluginThree'
export { pluginInput } from './pluginInput'
export { pluginEntities, createQuery } from './pluginEntities'

export type System<T> = (engine: T) => void
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export type AnySystem = System<Runtime<any>>

export type Plugin<ProvidesResources, RequiresResources extends object = object> = {
    createResources(): ProvidesResources
    init?(world: Runtime<RequiresResources & ProvidesResources>): void
}

export type Array2 = [number, number]
export type Array3 = [number, number, number]
export type Array4 = [number, number, number, number]
export type Quat = Array4

export const X_AXIS: Readonly<Array3> = Object.freeze([1, 0, 0])
export const Y_AXIS: Readonly<Array3> = Object.freeze([0, 1, 0])
export const Z_AXIS: Readonly<Array3> = Object.freeze([0, 0, 1])
export const ORIGIN: Readonly<Array3> = Object.freeze([0, 0, 0])
