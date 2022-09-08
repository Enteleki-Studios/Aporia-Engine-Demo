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
            const { position: targetPosition, rotation } = cameraTargets[0].get(PositionComponent)

            position.fromArray([targetPosition.x, 2, targetPosition.z])

            lookAt.fromArray([0, 0, 1]).applyQuaternion(rotation).add(position)
        })
    }
}
