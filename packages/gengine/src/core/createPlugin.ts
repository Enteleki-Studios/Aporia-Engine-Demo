import { type World } from 'core'

export type Plugin = {
    name: string
    init(world: World): void
}

type PreparePlugin<P extends Plugin, T = void> = (options: T) => P

export const createPlugin = <P extends Plugin, T = void>(preparePlugin: PreparePlugin<P, T>) => {
    const pluginCreator = (options: T): P => {
        return preparePlugin(options)
    }

    return pluginCreator
}
