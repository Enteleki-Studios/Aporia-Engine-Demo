import {
    System,
    ECSFilter,
    HeroComponent,
    AIComponent,
    PositionComponent,
    Array3,
    VelocityComponent,
    DirectionComponent,
} from 'gengine'
import { Vec3 } from 'gl-matrix/dist/esm'

const targetLocation: Array3 = [0, 0, 0]

export class AISystem implements System {
    heroFilter = new ECSFilter([HeroComponent, PositionComponent])
    aiFilter = new ECSFilter([AIComponent, DirectionComponent, PositionComponent, VelocityComponent])

    filters = [this.heroFilter, this.aiFilter]

    tick() {
        this.heroFilter.entities.forEach((hero) => {
            // TODO assumes one hero
            const { position } = hero.get(PositionComponent)
            Vec3.copy(targetLocation, position)
        })

        this.aiFilter.entities.forEach((aiEntity) => {
            const { position } = aiEntity.get(PositionComponent)
            const { velocity } = aiEntity.get(VelocityComponent)
            const { direction } = aiEntity.get(DirectionComponent)

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
        })
    }
}
