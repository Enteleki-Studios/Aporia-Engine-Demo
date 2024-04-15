import { Vec3 } from 'gl-matrix'

import { cameraComponent, directionComponent, transform3D } from '../components'
import { cameraFilter, cameraTargetFilter } from 'filters'
import { type World, createSystem } from 'core'

export const firstPersonCameraSystem = createSystem('first-person camera', () => (world: World) => {
    const [cameraTarget] = world.ecs.filterBy(cameraTargetFilter)

    world.ecs.filterBy(cameraFilter).forEach((cameraEntity) => {
        const { position, lookAt } = cameraEntity.get(cameraComponent)
        const { position: targetPosition } = cameraTarget.get(transform3D)
        const { direction } = cameraTarget.get(directionComponent)

        Vec3.set(position, targetPosition[0], 2, targetPosition[2])

        Vec3.copy(lookAt, position)
        Vec3.add(lookAt, lookAt, direction)
    })
})
