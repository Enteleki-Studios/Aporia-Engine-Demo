import { type World } from 'core'

type Unnamed<T> = Omit<T, 'name'>
type Named<T> = T & { name: string }

export type Plugin = {
    name: string
    init(world: World): void
}

type PreparePlugin<P extends Unnamed<Plugin>, T = void> = (options: T) => P

export const createPlugin = <P extends Unnamed<Plugin>, T = void>(name: string, preparePlugin: PreparePlugin<P, T>) => {
    const pluginCreator = (options: T): Named<P> => {
        const plugin = preparePlugin(options) as P & { name: string }

        plugin.name = name

        return plugin
    }

    return pluginCreator
}
