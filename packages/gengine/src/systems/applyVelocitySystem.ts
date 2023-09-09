import { Vec3 } from 'gl-matrix/dist/esm'

import { World } from 'World'
import { PositionComponent, VelocityComponent } from 'components'
import { movingEntitiesFilter } from 'filters'

export const applyVelocitySystem = () => {
    const system = (world: World) => {
        world.ecs.filterBy(movingEntitiesFilter).forEach((entity) => {
            const { position } = entity.get(PositionComponent)
            const { velocity } = entity.get(VelocityComponent)

            Vec3.scaleAndAdd(position, position, velocity, world.timeElapsedS)
        })
    }
    system.label = 'apply velocity'
    return system
}
