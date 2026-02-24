import { vec3 } from 'gl-matrix'
import type { AmbientLight, Vector3 } from 'three'
import type { Sky } from 'three/addons/objects/Sky.js'

import type { DirectionalLight } from '@pluginThree'

export const updateSun = (
    ambientLight: AmbientLight,
    sunLight: DirectionalLight,
    sky: Sky,
    inclination: number,
    azimuth: number,
) => {
    const sun: vec3 = [0, 0, 0]

    const theta = Math.PI * (inclination - 0.5)
    const phi = 2 * Math.PI * (azimuth - 0.5)

    sun[0] = Math.cos(phi)
    sun[1] = Math.sin(theta)
    sun[2] = Math.sin(phi)

    ambientLight.intensity = inclination * 0.3

    sunLight.intensity = inclination * 5
    sunLight.position.fromArray(vec3.scale([], sun, 50))
    sunLight.helper.update()

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Three.js doesn't provide the type
    const skyUniforms = sky.material.uniforms as SkyShaderUniforms

    skyUniforms.turbidity.value = 3
    skyUniforms.rayleigh.value = 0.4
    skyUniforms.mieCoefficient.value = 0.009
    skyUniforms.mieDirectionalG.value = 0.75

    skyUniforms.cloudCoverage.value = 0.4
    skyUniforms.cloudDensity.value = 0.4
    skyUniforms.cloudElevation.value = 1

    skyUniforms.sunPosition.value.fromArray(sun)
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
