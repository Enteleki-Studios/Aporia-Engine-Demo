import { World } from './World'

export abstract class Plugin {
    abstract name: string
    abstract init: (world: World) => void
}

export type PluginConstructor<T extends Plugin> = new () => T
