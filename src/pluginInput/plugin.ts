import type { Plugin } from '@core'

import { InputManager, Keymap } from './inputManager'

export const pluginInput = <K extends Keymap>(
    keymap: K,
): Plugin<{ input: InputManager<K> }> => ({
    createResources: () => ({
        input: new InputManager(keymap),
    }),
    init(/*runtime*/) {
        // const { input } = runtime.resources
    },
})
