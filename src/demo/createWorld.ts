import { createDefaultComposer } from '@core'

import { pluginConsole } from '@pluginConsole'
import { DEFAULT_KEYMAP, pluginInput } from '@pluginInput'
import { pluginRapier3D } from '@pluginRapier3D'
import { pluginRapierThreeViz } from '@pluginRapierThreeViz'
import { pluginSky } from '@pluginSky'
import { pluginThree } from '@pluginThree'

export const createWorld = () =>
    createDefaultComposer()
        .addPlugin(pluginConsole())
        .addPlugin(pluginInput(DEFAULT_KEYMAP))
        .addPlugin(pluginThree())
        .addPlugin(pluginSky())
        .addPlugin(pluginRapier3D())
        .addPlugin(pluginRapierThreeViz())
        .build()

export type World = Awaited<ReturnType<typeof createWorld>>
