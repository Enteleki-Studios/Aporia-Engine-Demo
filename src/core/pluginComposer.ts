import {
    type AnyPlugin,
    type Plugin,
    type PluginsToResources,
    Runtime,
    type World,
} from '@core'

import { pluginEntities } from '@pluginEntities'
import { DEFAULT_KEYMAP, type Keymap, pluginInput } from '@pluginInput'

type CheckDependencies<Current extends object, Required extends object> = [
    keyof Required,
] extends [never]
    ? true
    : [Current] extends [never]
      ? false
      : Current extends Required
        ? true
        : false

export class PluginComposer<P extends AnyPlugin[]> {
    private plugins: P

    constructor(plugins: P) {
        this.plugins = plugins
    }

    addPlugin<RP extends object, RD extends object>(
        plugin: CheckDependencies<PluginsToResources<P>, RD> extends true
            ? Plugin<RP, RD>
            : never,
    ): PluginComposer<[...P, Plugin<RP, RD>]> {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Dependency checking covers us here
        return new PluginComposer([...this.plugins, plugin]) as PluginComposer<
            [...P, Plugin<RP, RD>]
        >
    }

    async build() {
        type Resources = PluginsToResources<P>

        const resources = {}

        for (const plugin of this.plugins) {
            if (plugin.createResources) {
                Object.assign(resources, await plugin.createResources())
            }
        }

        const runtime = new Runtime()
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know better here
        const world = { runtime, ...resources } as World<Resources>
        runtime.setWorld(world)

        for (const plugin of this.plugins) {
            plugin.init?.(world)
        }

        return world
    }
}

type Config<K extends Keymap> = {
    keymap: K
}

export const DEFAULT_CONFIG = {
    keymap: DEFAULT_KEYMAP,
} as const

export const createDefaultComposer = <K extends Keymap>(config: Config<K>) => {
    return new PluginComposer([])
        .addPlugin(pluginEntities())
        .addPlugin(pluginInput(config.keymap))
}

export type DefaultResources = Omit<
    Awaited<ReturnType<ReturnType<typeof createDefaultComposer>['build']>>,
    'runtime'
>
