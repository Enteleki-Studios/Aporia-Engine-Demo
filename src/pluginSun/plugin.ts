import { AmbientLight } from 'three'
import { Sky } from 'three/addons/objects/Sky.js'

import type { Plugin, PluginsToResources, WorldWithPlugin } from '@core'

import { PluginClock } from '@pluginClock'
import type { PluginEntities } from '@pluginEntities'
import type { PluginRuntime } from '@pluginRuntime'
import { DirectionalLight, type PluginThree } from '@pluginThree'

import { syncSun } from './systems'
import { updateSun } from './updateSun'

type Provides = {
    sun: {
        ambientLight: AmbientLight
        sunLight: DirectionalLight
        sky: Sky
    }
}

type Dependencies = PluginsToResources<
    [PluginRuntime, PluginClock, PluginEntities, PluginThree]
>

export type PluginSun = ReturnType<typeof pluginSun>
export type SunWorld = WorldWithPlugin<PluginSun>

export const pluginSun = (): Plugin<Provides, Dependencies> => ({
    createResources() {
        const sky = new Sky()
        sky.scale.setScalar(420000)

        return {
            sun: {
                ambientLight: new AmbientLight(0xffffff),
                sunLight: new DirectionalLight(0xffffff, 1),
                sky,
            },
        }
    },
    init(world) {
        const { renderer, helperStore } = world.three
        const { ambientLight, sunLight, sky } = world.sun

        renderer.scene.add(ambientLight)
        renderer.scene.add(sunLight)
        renderer.scene.add(sky)

        updateSun(ambientLight, sunLight, sky, 90, 0)

        helperStore.addHelper('shadow', sunLight.shadowHelper)
        helperStore.addHelper('light', sunLight.helper)

        world.runtime.addSystem(syncSun)
    },
})
