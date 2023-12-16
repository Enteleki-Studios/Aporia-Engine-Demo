import { Vec3 } from 'gl-matrix/dist/esm'

import { positionComponent, velocityComponent } from 'components'
import { movingEntitiesFilter } from 'filters'
import { type World, createSystem } from 'core'

export const applyVelocitySystem = createSystem('apply velocity', () => (world: World) => {
    world.ecs.filterBy(movingEntitiesFilter).forEach((entity) => {
        const { position } = entity.get(positionComponent)
        const { velocity } = entity.get(velocityComponent)

        Vec3.scaleAndAdd(position, position, velocity, world.timeElapsedS)
    })
})
