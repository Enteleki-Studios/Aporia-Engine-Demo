import { type SkyWorld, skyQuery } from '@pluginSky'

import { updateSky } from './updateSky'

export const syncSky = (world: SkyWorld) => {
    const skyResult = world.entities.queryFirst(skyQuery)

    if (skyResult) {
        const [[skySettings]] = skyResult

        if (skySettings.needsUpdate) {
            const { ambientLight, sunLight, sky } = world.sun

            updateSky(ambientLight, sunLight, sky, skySettings)

            skySettings.needsUpdate = false
        }
    }

    const { time } = world.sun.sky.material.uniforms

    if (time) {
        time.value = world.clock.elapsedTime * 0.4
    }
}
