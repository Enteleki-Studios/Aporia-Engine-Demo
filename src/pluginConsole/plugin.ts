import type { Plugin, WorldWithPlugin } from '@core'

import { Hermit, echo, help } from '@enteleki-studios/hermit-shell'

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
        const { hermit } = world.console

        hermit.interceptConsole()

        hermit.addUtility(help(hermit))
        hermit.addUtility(echo)
    },
})
