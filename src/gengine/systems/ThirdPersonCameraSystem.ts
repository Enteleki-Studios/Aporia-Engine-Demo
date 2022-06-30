import { Vector3 } from 'three'
import { PositionComponent } from '../components/PositionComponent'
import { CameraComponent } from '../components/CameraComponent'
import { InputComponent } from '../components/InputComponent'
import { CameraTargetComponent } from '../components/CameraTargetComponent'
import { System } from '../ECS/System'
import { World } from '../World'
import { ECSFilter } from '../ECS/ECSFilter'

const camPosition = new Vector3()

export class ThirdPersonCameraSystem extends System {
    cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent])
    cameraFilter = new ECSFilter([CameraComponent, InputComponent])

    filters = [this.cameraTargetFilter, this.cameraFilter]

    tick(world: World) {
        const delta = world.timeElapsedS
        const cameraTargets = [...this.cameraTargetFilter.entities]

        this.cameraFilter.entities.forEach((cameraEntity) => {
            const cameraComponent = cameraEntity.get(CameraComponent)
            const { position: targetPosition } = cameraTargets[0].get(PositionComponent)

            camPosition.copy(targetPosition)

            camPosition.x += 5
            camPosition.z += 7
            camPosition.y += 7

            cameraComponent.position.lerp(camPosition, 1 - (0.005 ** delta))
            // cameraComponent.lookAt.lerp(targetPosition, 1 - (0.00001 ** delta))
            cameraComponent.lookAt.lerp(targetPosition, 1 - (0.005 ** delta))
            // cameraComponent.position.copy(camPosition)
            // cameraComponent.lookAt.copy(targetPosition)
        })
    }
}
// Panning
// forwardQ.setFromAxisAngle(Y_AXIS, -2 * Math.PI * inputComponent.mouse.pan.x * delta * 0.01)
