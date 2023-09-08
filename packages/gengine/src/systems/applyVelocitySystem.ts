import { Vec3 } from 'gl-matrix/dist/esm'

import { World } from '../World'
import { PositionComponent, VelocityComponent } from '../components'
import { movingEntities } from 'filters'

export const applyVelocitySystem = (world: World) => {
    world.ecs.entitiesByFilter.get(movingEntities)?.forEach((entity) => {
        const { position } = entity.get(PositionComponent)
        const { velocity } = entity.get(VelocityComponent)

        Vec3.scaleAndAdd(position, position, velocity, world.timeElapsedS)
    })
}
