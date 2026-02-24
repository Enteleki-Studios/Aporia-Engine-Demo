import { type SunWorld, sunQuery } from '@pluginSun'

import { updateSun } from './updateSun'

export const syncSun = (world: SunWorld) => {
    const sunResult = world.entities.queryFirst(sunQuery)

    if (sunResult) {
        const [[sunDef]] = sunResult

        if (sunDef.needsUpdate) {
            const { ambientLight, sunLight, sky } = world.sun

            updateSun(ambientLight, sunLight, sky, sunDef.inclination, sunDef.azimuth)

            sunDef.needsUpdate = false
        }
    }

    const { time } = world.sun.sky.material.uniforms

    if (time) {
        time.value = world.clock.elapsedTime
    }
}
