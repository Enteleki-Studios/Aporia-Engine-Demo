import { Quaternion } from 'three'
import { PositionComponent } from '../components/PositionComponent'
import type { ComponentManager } from '../managers/ComponentManager'
import type { CameraComponent } from '../components/CameraComponent'
import type { InputComponent } from '../components/InputComponent'
import { CameraTargetComponent } from '../components/CameraTargetComponent'
import { Y_AXIS } from '../constants'

const forwardQ = new Quaternion()

export function thirdPersonCameraSystem(delta: number, componentManager: ComponentManager) {
    // const cameraTargets = componentManager.getTuplesByQueryGeneric<[CameraTargetComponent, PositionComponent]>(
    //     ['cameraTarget', 'position'],
    // )
    const cameraTargets = componentManager.getTuplesByClass(CameraTargetComponent, PositionComponent)

    componentManager.getTuplesByQueryGeneric<[CameraComponent, InputComponent]>(
        ['camera', 'input'],
    ).forEach(([cameraComponent, inputComponent]) => {
        const { direction, position: camPosition } = cameraComponent
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

        cameraComponent.lookAt.copy(targetPosition)
        cameraComponent.lookAt.setY(2) // Look a little higher
    })
}
