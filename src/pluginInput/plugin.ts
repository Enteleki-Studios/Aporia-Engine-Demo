import type { Plugin } from '@enteleki-studios/aporia-engine-core'

import type { Keymap } from '.'
import { InputManager } from './inputManager'

export const pluginInput = <K extends Keymap>(
    keymap: K,
): Plugin<{ input: InputManager<K> }> => ({
    createResources: () => ({
        input: new InputManager(keymap),
    }),
    init(world) {
        world.runtime.addSystem(() => {
            world.input.flushInputs()
        })
    },
})
