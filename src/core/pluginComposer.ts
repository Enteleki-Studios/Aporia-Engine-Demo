import { type AnyPlugin, type Plugin, type PluginsToResources, type World } from '@core'

import { pluginClock } from '@pluginClock'
import { pluginEntities } from '@pluginEntities'
import { DEFAULT_KEYMAP, type Keymap, pluginInput } from '@pluginInput'
import { pluginRuntime } from '@pluginRuntime'

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

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know better here
        const world = resources as World<Resources>

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
        .addPlugin(pluginClock())
        .addPlugin(pluginRuntime())
        .addPlugin(pluginEntities())
        .addPlugin(pluginInput(config.keymap))
}

export type DefaultResources = Awaited<
    ReturnType<ReturnType<typeof createDefaultComposer>['build']>
>
