import { type World } from 'World'
import type { Optional } from '../definitions'

export type Plugin = {
    name: string
    init(world: World): void
}

type PreparePlugin<T = void> = (options: T) => Optional<Plugin, 'name'>

export const createPlugin = <T = void>(name: string, preparePlugin: PreparePlugin<T>) => {
    const pluginCreator = (options: T): Plugin => {
        const plugin = preparePlugin(options)
        plugin.name = name
        return plugin as Plugin
    }

    return pluginCreator
}
