import { DEFAULT_CONFIG, createDefaultComposer } from '@core'

import { pluginRapier3D } from '@pluginRapier3D'
import { pluginRapierThreeViz } from '@pluginRapierThreeViz'
import { pluginThree } from '@pluginThree'

export const createWorld = () =>
    createDefaultComposer(DEFAULT_CONFIG)
        .addPlugin(pluginThree())
        .addPlugin(pluginRapier3D())
        .addPlugin(pluginRapierThreeViz())
        .build()
export type World = Awaited<ReturnType<typeof createWorld>>
