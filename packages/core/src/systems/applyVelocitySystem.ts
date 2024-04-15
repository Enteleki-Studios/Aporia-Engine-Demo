import { Vec3 } from 'gl-matrix'

import { transform3D, velocityComponent } from 'components'
import { movingEntitiesFilter } from 'filters'
import { type World, createSystem } from 'core'

export const applyVelocitySystem = createSystem('apply velocity', () => (world: World) => {
    for (const entity of world.ecs.filterBy(movingEntitiesFilter)) {
        const { position } = entity.get(transform3D)
        const { velocity } = entity.get(velocityComponent)

        Vec3.scaleAndAdd(position, position, velocity, world.timeElapsedS)
    }
})
