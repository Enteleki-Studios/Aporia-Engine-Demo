import type { Plugin, PluginsToResources } from '@core'

import type { PluginRuntime } from '@pluginRuntime'

import type { Keymap } from '.'
import { InputManager } from './inputManager'

type Dependencies = PluginsToResources<[PluginRuntime]>

export const pluginInput = <K extends Keymap>(
    keymap: K,
): Plugin<{ input: InputManager<K> }, Dependencies> => ({
    createResources: () => ({
        input: new InputManager(keymap),
    }),
    init(world) {
        world.runtime.addSystem(() => {
            world.input.flushInputs()
        })
    },
})
