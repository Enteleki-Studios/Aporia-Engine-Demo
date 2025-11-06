import { type AnyPlugin, type Plugin, type PluginsToResources, Runtime } from '@core'

import { pluginEntities } from '@pluginEntities'
import { pluginInput } from '@pluginInput'

type CheckDependencies<Current extends object, Required extends object> = [
    keyof Required,
] extends [never]
    ? true
    : Required extends Current
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
        const runtime = new Runtime(resources as Resources)

        for (const plugin of this.plugins) {
            plugin.init?.(runtime)
        }

        return runtime
    }
}

export const createDefaultComposer = () => {
    return new PluginComposer([]).addPlugin(pluginEntities()).addPlugin(pluginInput())
}

export type DefaultResources = Awaited<
    ReturnType<ReturnType<typeof createDefaultComposer>['build']>
>['resources']
