import {
    Array3,
    ECSFilter,
    type World,
    createSystem,
    directionComponent,
    heroFilter,
    tags,
    transform3D,
    velocityComponent,
} from '@gengine/core'

import { Vec3 } from 'gl-matrix'

export const aiSystemFilter = new ECSFilter([directionComponent, transform3D, velocityComponent], [tags.ai])

export const aiSystem = createSystem('ai', () => {
    const targetLocation: Array3 = [0, 0, 0]

    return (world: World) => {
        for (const hero of world.ecs.filterBy(heroFilter)) {
            // TODO assumes one hero
            const { position } = hero.get(transform3D)
            Vec3.copy(targetLocation, position)
        }

        for (const aiEntity of world.ecs.filterBy(aiSystemFilter)) {
            const { position } = aiEntity.get(transform3D)
            const { velocity } = aiEntity.get(velocityComponent)
            const { direction } = aiEntity.get(directionComponent)

            const isMoving = Vec3.squaredLength(velocity) > 0

            // Distance + direction to player
            Vec3.sub(velocity, targetLocation, position)

            const distToPlayerSQ = Vec3.squaredLength(velocity)

            const inRange = distToPlayerSQ <= 4
            const shouldMove = !inRange && (isMoving || distToPlayerSQ >= 6)

            // Direction to player
            Vec3.normalize(velocity, velocity)

            // Rotate entity to face player
            Vec3.copy(direction, velocity)
            direction[1] = 0

            // Set enemy speed
            Vec3.scale(velocity, velocity, shouldMove ? 2 : 0)

            // TODO allow for 3D, something with snap to floor
            velocity[1] = -9
        }
    }
})
