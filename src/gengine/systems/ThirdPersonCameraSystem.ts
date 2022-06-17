import { Quaternion, Vector3 } from 'three'
import { PositionComponent } from '../components/PositionComponent'
import { CameraComponent } from '../components/CameraComponent'
import { InputComponent } from '../components/InputComponent'
import { CameraTargetComponent } from '../components/CameraTargetComponent'
import { Y_AXIS } from '../constants'
import { System } from '../ECS/System'
import { World } from '../World'
import { ECSFilter } from '../ECS/ECSFilter'

const forwardQ = new Quaternion()
const camPosition = new Vector3()

export class ThirdPersonCameraSystem extends System {
    cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent])
    cameraFilter = new ECSFilter([CameraComponent, InputComponent])

    filters = [this.cameraTargetFilter, this.cameraFilter]
    // const cameraTargets = componentManager.getTuplesByClass(CameraTargetComponent, PositionComponent)

    tick(world: World) {
        const delta = world.timeElapsedS
        const cameraTargets = [...this.cameraTargetFilter.entities]

        this.cameraFilter.entities.forEach((cameraEntity) => {
            const cameraComponent = cameraEntity.get(CameraComponent)
            const inputComponent = cameraEntity.get(InputComponent)
            const { position: targetPosition } = cameraTargets[0].get(PositionComponent)

            // Update forwards direction
            // Set Q to difference in direction
            forwardQ.setFromAxisAngle(Y_AXIS, -2 * Math.PI * inputComponent.mouse.pan.x * delta * 0.01)
            // Apply difference to component direction
            cameraComponent.direction.multiply(forwardQ)

            camPosition.set(0, 0, 1)
            // camPosition.copy(position)
            camPosition.applyQuaternion(cameraComponent.direction) // Point camera forward
            camPosition.multiplyScalar(-5) // Move it back
            camPosition.y += 5 // Move it up
            camPosition.add(targetPosition) // Move it into position

            cameraComponent.position.lerp(camPosition, 1 - (0.005 ** delta))
            cameraComponent.lookAt.lerp(targetPosition, 1 - (0.00001 ** delta))
            // cameraComponent.position.copy(camPosition)
            // cameraComponent.lookAt.copy(targetPosition)
            cameraComponent.lookAt.setY(2) // Look a little higher
        })
    }
}
