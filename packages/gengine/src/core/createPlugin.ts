import { type World } from 'core'

type Unnamed<T> = Omit<T, 'name'>
type Named<T> = T & { name: string }

type PreparePlugin<P extends Unnamed<Plugin>, T = void> = (options: T) => P

export type Plugin = {
    name: string
    init(world: World): void
}

export type PluginCreator<P extends Plugin = Plugin, T = void> = {
    (options: T): P,
    label: string,
}

export type PluginFromPluginCreator<PC extends PluginCreator> = ReturnType<PC>

export const createPlugin = <P extends Unnamed<Plugin>, T = void>(name: string, preparePlugin: PreparePlugin<P, T>): PluginCreator<Named<P>, T> => {
    const pluginCreator = (options: T): Named<P> => {
        const plugin = {
            name,
            ...preparePlugin(options),
        }

        return plugin
    }

    pluginCreator.label = name

    return pluginCreator
}
