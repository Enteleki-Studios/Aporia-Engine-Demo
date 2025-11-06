import { createDefaultComposer } from '@core'

import { pluginRapier3D } from '@pluginRapier3D'
import { pluginThree } from '@pluginThree'

export const createWorld = () =>
    createDefaultComposer().addPlugin(pluginThree()).addPlugin(pluginRapier3D()).build()
export type World = Awaited<ReturnType<typeof createWorld>>
