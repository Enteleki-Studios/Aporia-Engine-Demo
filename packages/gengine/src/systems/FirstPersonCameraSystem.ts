import { Vec3 } from 'gl-matrix/dist/esm'

import { cameraComponent, directionComponent, positionComponent } from '../components'
import { World } from 'World'
import { cameraFilter, cameraTargetFilter } from 'filters'
import { createSystem } from 'ecs'

export const firstPersonCameraSystem = createSystem('first-person camera', () => (world: World) => {
    const cameraTargets = [...world.ecs.filterBy(cameraTargetFilter)]

    world.ecs.filterBy(cameraFilter).forEach((cameraEntity) => {
        const { position, lookAt } = cameraEntity.get(cameraComponent)
        const { position: targetPosition } = cameraTargets[0].get(positionComponent)
        const { direction } = cameraTargets[0].get(directionComponent)

        Vec3.set(position, targetPosition[0], 2, targetPosition[2])

        Vec3.copy(lookAt, position)
        Vec3.add(lookAt, lookAt, direction)
    })
})
