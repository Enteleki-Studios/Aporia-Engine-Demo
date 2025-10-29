import { createDefaultComposer } from '@core'

import { pluginThree } from '@pluginThree'

export const createWorld = () => createDefaultComposer().addPlugin(pluginThree()).build()
export type World = ReturnType<typeof createWorld>
