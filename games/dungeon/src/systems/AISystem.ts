import {
    type World,
    ECSFilter,
    positionComponent,
    Array3,
    velocityComponent,
    directionComponent,
    heroFilter,
    createSystem,
    tags,
} from 'gengine'
import { Vec3 } from 'gl-matrix/dist/esm'

export const aiSystemFilter = new ECSFilter([directionComponent, positionComponent, velocityComponent], [tags.ai])

export const aiSystem = createSystem('ai', () => {
    const targetLocation: Array3 = [0, 0, 0]

    return (world: World) => {
        for (const hero of world.ecs.filterBy(heroFilter)) {
            // TODO assumes one hero
            const { position } = hero.get(positionComponent)
            Vec3.copy(targetLocation, position)
        }

        for (const aiEntity of world.ecs.filterBy(aiSystemFilter)) {
            const { position } = aiEntity.get(positionComponent)
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

            // Set enemy speed
            Vec3.scale(velocity, velocity, shouldMove ? 2 : 0)
        }
    }
})
