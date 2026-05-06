import {
    type AnyPlugin,
    type Plugin,
    type PluginsToResources,
    Runtime,
    type World,
} from '@core'

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
        plugin: CheckDependencies<World<PluginsToResources<P>>, RD> extends true
            ? Plugin<RP, RD>
            : never,
    ): PluginComposer<[...P, Plugin<RP, RD>]> {
        return new PluginComposer([...this.plugins, plugin])
    }

    async build() {
        type Resources = PluginsToResources<P>
        type FinalWorld = World<Resources>

        const resources: { runtime?: Runtime<FinalWorld> } = {
            runtime: new Runtime<FinalWorld>(),
        }

        for (const plugin of this.plugins) {
            if (plugin.createResources) {
                Object.assign(resources, await plugin.createResources())
            }
        }

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Composed resources match the inferred world type
        const world = resources as FinalWorld
        world.runtime.setWorld(world)

        for (const plugin of this.plugins) {
            plugin.init?.(world)
        }

        return world
    }
}
