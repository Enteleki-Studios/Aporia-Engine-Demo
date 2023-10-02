import { Vec3 } from 'gl-matrix/dist/esm'

import { World } from 'World'
import { positionComponent, velocityComponent } from 'components'
import { movingEntitiesFilter } from 'filters'
import { createSystem } from 'ecs'

export const applyVelocitySystem = createSystem('apply velocity', () => (world: World) => {
    world.ecs.filterBy(movingEntitiesFilter).forEach((entity) => {
        const test = entity.get(positionComponent)
        console.debug(test)
        const { position } = entity.get(positionComponent)
        const { velocity } = entity.get(velocityComponent)

        Vec3.scaleAndAdd(position, position, velocity, world.timeElapsedS)
    })
})
