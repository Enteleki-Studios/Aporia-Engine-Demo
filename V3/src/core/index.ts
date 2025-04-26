/* eslint-disable @typescript-eslint/no-explicit-any */

export { createEngine, createDefaultEngine } from './engine'
export { createComponent } from './createComponent'
export { pluginRuntime } from './pluginRuntime'
export { pluginClock } from './pluginClock'
export { pluginThree } from './pluginThree'
export { pluginEntities } from './pluginEntities'

export type System<T> = (engine: T) => void
export type AnySystem = System<any>

export type Plugin<TInput, TOutput> = {
    setup: (engine: TInput) => TOutput
    systems?: System<TInput & TOutput>[]
}

export type Array2 = [number, number]
export type Array3 = [number, number, number]
export type Array4 = [number, number, number, number]
export type Quat = Array4
