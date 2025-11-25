import type { ThreeWorld } from '@pluginThree'

import { dynamicRenderables } from '../queries'

export const syncTransforms = (world: ThreeWorld) => {
    world.resources.entities
        .query(dynamicRenderables)
        .forEach(([[transform], entity]) => {
            const group = world.resources.three.objectStore.get(entity.id)

            if (group) {
                group.position.fromArray(transform.position)
                group.scale.fromArray(transform.scale)
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
}
