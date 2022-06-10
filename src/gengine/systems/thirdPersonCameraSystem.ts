import { Quaternion, Vector3 } from 'three'
import { PositionComponent } from '../components/PositionComponent'
import type { ComponentManager } from '../managers/ComponentManager'
import { CameraComponent } from '../components/CameraComponent'
import { InputComponent } from '../components/InputComponent'
import { CameraTargetComponent } from '../components/CameraTargetComponent'
import { Y_AXIS } from '../constants'

const forwardQ = new Quaternion()
const camPosition = new Vector3()

export function thirdPersonCameraSystem(delta: number, componentManager: ComponentManager) {
    const cameraTargets = componentManager.getTuplesByClass(CameraTargetComponent, PositionComponent)

    componentManager.getTuplesByClass(CameraComponent, InputComponent).forEach(([cameraComponent, inputComponent]) => {
        const { direction } = cameraComponent
        const { position: targetPosition } = cameraTargets[0][1]

        // Update forwards direction
        // Set Q to difference in direction
        forwardQ.setFromAxisAngle(Y_AXIS, -2 * Math.PI * inputComponent.mouse.pan.x * delta * 0.01)
        // Apply difference to component direction
        direction.multiply(forwardQ)

        camPosition.set(0, 0, 1)
        // camPosition.copy(position)
        camPosition.applyQuaternion(direction) // Point camera forward
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
