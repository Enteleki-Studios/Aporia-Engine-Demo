import type { Simplify, UnionToIntersection } from 'type-fest'

import type { Runtime } from './runtime'

export { createDefaultComposer, type DefaultResources } from './pluginComposer'
export { Runtime } from './runtime'
export {
    createComponent,
    type AnyComponent,
    type AnyComponentCreator,
    type ComponentKey,
} from './components/createComponent'
export { ObjectStore } from './objectStore'
export { Clock } from './clock'
export * from './shapes'

export type Plugin<
    ProvidesResources extends object,
    RequiresResources extends object = object,
> = {
    createResources?(): ProvidesResources | Promise<ProvidesResources>
    init?<R extends Simplify<RequiresResources & ProvidesResources>>(
        world: Runtime<R>,
    ): void
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export type AnyPlugin = Plugin<any>
export type PluginToResources<P extends AnyPlugin> = Awaited<
    ReturnType<NonNullable<P['createResources']>>
>
export type PluginCreatorToResources<PC extends () => AnyPlugin> = PluginToResources<
    ReturnType<PC>
>
export type PluginsToResources<PA extends AnyPlugin[]> = Simplify<
    UnionToIntersection<Awaited<ReturnType<NonNullable<PA[number]['createResources']>>>>
>
export type PluginToRequiredResources<P extends AnyPlugin> =
    P extends Plugin<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
        any,
        infer Requires
    >
        ? Requires
        : never

export type WorldWithPlugin<P extends AnyPlugin> = Runtime<
    Simplify<PluginToRequiredResources<P> & PluginToResources<P>>
>

export type System<T> = (world: T) => void
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for lib code
export type AnySystem = System<Runtime<any>>

export type Array2 = [number, number]
export type Array3 = [number, number, number]
export type Array4 = [number, number, number, number]
export type Quat = Array4

export const X_AXIS: Readonly<Array3> = Object.freeze([1, 0, 0])
export const Y_AXIS: Readonly<Array3> = Object.freeze([0, 1, 0])
export const Z_AXIS: Readonly<Array3> = Object.freeze([0, 0, 1])
export const ORIGIN: Readonly<Array3> = Object.freeze([0, 0, 0])
