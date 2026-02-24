import { vec3 } from 'gl-matrix'
import { AmbientLight, type Vector3 } from 'three'
import { Sky } from 'three/addons/objects/Sky.js'

import type { Plugin, PluginsToResources, WorldWithPlugin } from '@core'

import { DirectionalLight, type PluginThree } from '@pluginThree'

type Dependencies = PluginsToResources<[PluginThree]>

export type PluginSun = ReturnType<typeof pluginSun>
export type SunWorld = WorldWithPlugin<PluginSun>

export const pluginSun = (): Plugin<object, Dependencies> => ({
    init(world) {
        const { renderer, helperStore } = world.three

        // Sun position
        const sun: vec3 = [0, 0, 0]
        const inclination = 0.7 // elevation (0–1)
        const azimuth = 0.9 // east/west (0–1)

        const theta = Math.PI * (inclination - 0.5)
        const phi = 2 * Math.PI * (azimuth - 0.5)

        sun[0] = Math.cos(phi)
        sun[1] = Math.sin(theta)
        sun[2] = Math.sin(phi)

        // Lighting
        renderer.scene.add(new AmbientLight(0xffffff, inclination / 3))
        const light = new DirectionalLight(0xffffff, inclination * 5)
        light.position.fromArray(vec3.scale([], sun, 50))
        renderer.scene.add(light)

        helperStore.addHelper('shadow', light.shadowHelper)
        helperStore.addHelper('light', light.helper)
        light.helper.update()

        // Sky
        const sky = new Sky()
        sky.scale.setScalar(2000)
        sky.material.toneMapped = false
        sky.material.fog = false
        sky.material.depthWrite = false
        sky.material.depthTest = false
        sky.renderOrder = -1

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Three.js doesn't provide the type
        const skyUniforms = sky.material.uniforms as SkyShaderUniforms

        skyUniforms.turbidity.value = 0.2 // Higher = hazier
        skyUniforms.rayleigh.value = 0.5 * inclination // Lower = bluer
        skyUniforms.mieCoefficient.value = 0.05 * inclination // White haze
        skyUniforms.mieDirectionalG.value = 0.6 // Sun glow sharpness
        skyUniforms.sunPosition.value.fromArray(sun)

        renderer.scene.add(sky)
    },
})

type SkyShaderUniforms = {
    turbidity: { value: number }
    rayleigh: { value: number }
    mieCoefficient: { value: number }
    mieDirectionalG: { value: number }
    sunPosition: { value: Vector3 }
    up: { value: Vector3 }
}
