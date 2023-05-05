import { Vec3 } from 'gl-matrix/dist/esm'

import { ECSFilter, System } from '../ecs'
import { CameraComponent, CameraTargetComponent, DirectionComponent, PositionComponent } from '../components'

export class FirstPersonCameraSystem implements System {
    cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent, DirectionComponent])
    cameraFilter = new ECSFilter([CameraComponent])

    filters = [this.cameraFilter, this.cameraTargetFilter]

    tick() {
        const cameraTargets = [...this.cameraTargetFilter.entities]

        this.cameraFilter.entities.forEach((cameraEntity) => {
            const { position, lookAt } = cameraEntity.get(CameraComponent)
            const { position: targetPosition } = cameraTargets[0].get(PositionComponent)
            const { direction } = cameraTargets[0].get(DirectionComponent)

            Vec3.set(position, targetPosition.x, 2, targetPosition.z)

            Vec3.copy(lookAt, position)
            Vec3.add(lookAt, lookAt, direction)
        })
    }
}
