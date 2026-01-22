import type { Plugin, PluginsToResources } from '@core'

import type { PluginClock } from '@pluginClock'

import { Runtime } from './runtime'

type Provides = {
    runtime: Runtime
}

type Dependencies = PluginsToResources<[PluginClock]>

export const pluginRuntime = (): Plugin<Provides, Dependencies> => ({
    createResources() {
        return {
            runtime: new Runtime(),
        }
    },
    init(world) {
        world.runtime.setWorld(world)
    },
})

export type PluginRuntime = ReturnType<typeof pluginRuntime>
