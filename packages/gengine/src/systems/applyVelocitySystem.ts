import { Vec3 } from 'gl-matrix/dist/esm'

import { World } from 'World'
import { PositionComponent, VelocityComponent } from 'components'
import { movingEntitiesFilter } from 'filters'
import { createSystem } from 'ecs'

export const applyVelocitySystem = createSystem('apply velocity', () => (world: World) => {
    world.ecs.filterBy(movingEntitiesFilter).forEach((entity) => {
        const { position } = entity.get(PositionComponent)
        const { velocity } = entity.get(VelocityComponent)

        Vec3.scaleAndAdd(position, position, velocity, world.timeElapsedS)
    })
})
