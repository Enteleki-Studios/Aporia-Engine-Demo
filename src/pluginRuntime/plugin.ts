import type { Plugin } from '@core'

import { Runtime } from './runtime'

type Provides = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The actual world type isn't known until composition
    runtime: Runtime<any>
}

export const pluginRuntime = (): Plugin<Provides> => ({
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
