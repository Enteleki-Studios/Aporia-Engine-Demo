import type { Plugin, WorldWithPlugin } from '@core'

import { Hermit } from '@hermitShell'

type Provides = {
    console: {
        hermit: Hermit
    }
}

export type PluginConsole = ReturnType<typeof pluginConsole>
export type ConsoleWorld = WorldWithPlugin<PluginConsole>

export const pluginConsole = (): Plugin<Provides> => ({
    createResources() {
        return {
            console: {
                hermit: new Hermit(),
            },
        }
    },
    init(world) {
        world.console.hermit.interceptConsole()
    },
})
