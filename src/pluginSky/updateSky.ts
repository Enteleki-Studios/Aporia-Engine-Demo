import type { AmbientLight, Vector3 } from 'three'
import type { Sky } from 'three/addons/objects/Sky.js'

import { degToRad } from '@core/utils'

import { type SkySettings } from '@pluginSky'
import type { DirectionalLight } from '@pluginThree'

export const updateSky = (
    ambientLight: AmbientLight,
    sunLight: DirectionalLight,
    sky: Sky,
    settings: SkySettings,
) => {
    const { elevation, azimuth } = settings

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Three.js doesn't provide the type
    const skyUniforms = sky.material.uniforms as SkyShaderUniforms

    const sun = skyUniforms.sunPosition.value

    const phi = degToRad(90 - elevation)
    const theta = degToRad(azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    ambientLight.intensity = 0.4

    sunLight.intensity = Math.max(Math.min((elevation / 90) * 5, 3), 0.5)
    sunLight.position.copy(sun)
    sunLight.position.multiplyScalar(50)
    sunLight.helper.update()

    skyUniforms.turbidity.value = 2.5
    skyUniforms.rayleigh.value = 0.5
    skyUniforms.mieCoefficient.value = 0.003
    skyUniforms.mieDirectionalG.value = 0.75

    skyUniforms.cloudCoverage.value = 0.4
    skyUniforms.cloudDensity.value = 0.4
    skyUniforms.cloudElevation.value = 1
}

type SkyShaderUniforms = {
    turbidity: { value: number }
    rayleigh: { value: number }
    mieCoefficient: { value: number }
    mieDirectionalG: { value: number }
    sunPosition: { value: Vector3 }
    up: { value: Vector3 }
    cloudCoverage: { value: number }
    cloudDensity: { value: number }
    cloudElevation: { value: number }
}
