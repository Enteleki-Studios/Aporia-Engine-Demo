import { AmbientLight } from 'three'
import { Sky } from 'three/addons/objects/Sky.js'

import type { Plugin, PluginsToResources, WorldWithPlugin } from '@core'

import type { PluginClock } from '@pluginClock'
import type { PluginEntities } from '@pluginEntities'
import type { PluginRuntime } from '@pluginRuntime'
import { SkySettings } from '@pluginSky'
import { DirectionalLight, type PluginThree } from '@pluginThree'

import { syncSky } from './systems'
import { updateSky } from './updateSky'

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

export type PluginSky = ReturnType<typeof pluginSky>
export type SkyWorld = WorldWithPlugin<PluginSky>

export const pluginSky = (): Plugin<Provides, Dependencies> => ({
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

        updateSky(ambientLight, sunLight, sky, SkySettings())

        helperStore.addHelper('shadow', sunLight.shadowHelper)
        helperStore.addHelper('light', sunLight.helper)

        world.runtime.addSystem(syncSky)
    },
})
