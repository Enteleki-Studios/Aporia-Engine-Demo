import type { ThreeWorld } from '@pluginThree'

import { dynamicRenderables, perspectiveCameraQuery } from '../queries'

export const syncTransforms = (world: ThreeWorld) => {
    world.entities.query(dynamicRenderables).forEach(([[transform], entity]) => {
        const group = world.three.objectStore.get(entity.id)

        if (group) {
            group.position.fromArray(transform.position)
            if (
                group.quaternion.x !== transform.rotation[0] ||
                group.quaternion.y !== transform.rotation[1] ||
                group.quaternion.z !== transform.rotation[2] ||
                group.quaternion.w !== transform.rotation[3]
            ) {
                group.quaternion.fromArray(transform.rotation)
            }
        }
    })

    world.entities.query(perspectiveCameraQuery).forEach(([[_, transform], entity]) => {
        const camera = world.three.cameraStore.get(entity.id)

        if (camera) {
            camera.position.fromArray(transform.position)
            // TODO: Add check to see if quat needs updating
            camera.quaternion.fromArray(transform.rotation)
        }
    })
}
