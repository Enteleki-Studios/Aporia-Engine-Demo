import {
    type AnyPlugin,
    type Plugin,
    type PluginsToResources,
    type WithTypedRuntime,
    type World,
} from '@core'

import { pluginClock } from '@pluginClock'
import { pluginEntities } from '@pluginEntities'
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
        type TypedWorld = WithTypedRuntime<World<Resources>>

        const resources = {}

        for (const plugin of this.plugins) {
            if (plugin.createResources) {
                Object.assign(resources, await plugin.createResources())
            }
        }

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- We know the runtime type is correct
        const world = resources as TypedWorld

        for (const plugin of this.plugins) {
            plugin.init?.(world)
        }

        return world
    }
}

export const createDefaultComposer = () => {
    return new PluginComposer([])
        .addPlugin(pluginRuntime())
        .addPlugin(pluginClock())
        .addPlugin(pluginEntities())
}

export type DefaultResources = Awaited<
    ReturnType<ReturnType<typeof createDefaultComposer>['build']>
>
