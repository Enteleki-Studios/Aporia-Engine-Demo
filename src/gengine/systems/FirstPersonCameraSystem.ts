import { System } from '../ECS/System'
import { ECSFilter } from '../ECS/ECSFilter'

import { CameraComponent } from '../components/CameraComponent'
import { CameraTargetComponent } from '../components/CameraTargetComponent'
import { PositionComponent } from '../components/PositionComponent'

export class FirstPersonCameraSystem extends System {
    cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent])
    cameraFilter = new ECSFilter([CameraComponent])

    filters = [this.cameraFilter, this.cameraTargetFilter]

    tick() {
        const cameraTargets = [...this.cameraTargetFilter.entities]

        this.cameraFilter.entities.forEach((cameraEntity) => {
            const { position, lookAt } = cameraEntity.get(CameraComponent)
            const { position: targetPosition } = cameraTargets[0].get(PositionComponent)

            position.fromArray([targetPosition.x, 2, targetPosition.y])

            // lookAt.fromArray([position.x, position.y, position.z])
        })
    }
}
