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

            position.fromArray([targetPosition.x, 2, targetPosition.z])

            lookAt.copy(position).add(direction)
        })
    }
}
