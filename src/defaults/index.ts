import { PluginComposer } from '@enteleki-studios/aporia-engine-core'
import { pluginClock } from '@pluginClock'
import { pluginEntities } from '@pluginEntities'

export const createDefaultComposer = () => {
    return new PluginComposer([]).addPlugin(pluginClock()).addPlugin(pluginEntities())
}

export type DefaultResources = Awaited<
    ReturnType<ReturnType<typeof createDefaultComposer>['build']>
>
