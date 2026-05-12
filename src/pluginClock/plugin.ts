import { Clock, type Plugin } from '@enteleki-studios/aporia-engine-core'

type Provides = {
    clock: Clock
}

export const pluginClock = (): Plugin<Provides> => ({
    createResources() {
        return {
            clock: new Clock(),
        }
    },
    init(world) {
        // Add startFrame as first system (runs at the beginning of each frame)
        world.runtime.addSystem((w) => {
            w.clock.startFrame()
        })

        // Add endFrame as first debug system (runs after all regular systems)
        // TODO: Remove this use of addDebugSystem in favor of proper scheduling
        world.runtime.addDebugSystem((w) => {
            w.clock.endFrame()
        })
    },
})

export type PluginClock = ReturnType<typeof pluginClock>
