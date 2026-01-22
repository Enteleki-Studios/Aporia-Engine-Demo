import { Clock } from '@core'

export const pluginClock = () => ({
    createResources() {
        return {
            clock: new Clock(),
        }
    },
})

export type PluginClock = ReturnType<typeof pluginClock>
