import { type SkyWorld, sunQuery } from '@pluginSky'

import { updateSky } from './updateSky'

export const syncSky = (world: SkyWorld) => {
    const sunResult = world.entities.queryFirst(sunQuery)

    if (sunResult) {
        const [[sunDef]] = sunResult

        if (sunDef.needsUpdate) {
            const { ambientLight, sunLight, sky } = world.sun
            const { elevation, azimuth } = sunDef

            updateSky(ambientLight, sunLight, sky, elevation, azimuth)

            sunDef.needsUpdate = false
        }
    }

    const { time } = world.sun.sky.material.uniforms

    if (time) {
        time.value = world.clock.elapsedTime
    }
}
