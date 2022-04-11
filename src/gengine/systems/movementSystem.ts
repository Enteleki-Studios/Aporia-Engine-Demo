import { Vector3, Quaternion } from 'three'
import type { ComponentManager } from '../managers/ComponentManager'
import type { PositionComponent } from '../components/PositionComponent'
import type { InputComponent } from '../components/InputComponent'

const deceleration = new Vector3(-5, -0.0001, -5)
const acceleration = new Vector3(15, 0.01, 15)

const RUN_BOOST = 2
const ROTATION_SPEED = 8
const Y_AXIS = new Vector3(0, 1, 0)

const Q = new Quaternion()

export function movementSystem(delta: number, componentManager: ComponentManager) {
    componentManager.getTuplesByQueryGeneric<[InputComponent, PositionComponent]>(
        ['input', 'position'],
    ).forEach(([inputComponent, positionComponent]) => {
        const { velocity, quaternion: direction } = positionComponent

        const frameDeceleration = new Vector3(
            velocity.x * deceleration.x,
            velocity.y * deceleration.y,
            velocity.z * deceleration.z,
        )

        frameDeceleration.multiplyScalar(delta)

        frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(
            Math.abs(frameDeceleration.z),
            Math.abs(velocity.z),
        )

        velocity.add(frameDeceleration)

        // TODO diagonal movement shouldn't be faster
        const boost = inputComponent.input.run.hold ? RUN_BOOST : 1

        if (inputComponent.input.up.hold) {
            velocity.z += acceleration.z * delta * boost
        }
        if (inputComponent.input.down.hold) {
            velocity.z -= acceleration.z * delta * boost
        }
        if (inputComponent.input.left.hold) {
            velocity.x += acceleration.x * delta * boost
        }
        if (inputComponent.input.right.hold) {
            velocity.x -= acceleration.x * delta * boost
        }

        // Set Q to difference in direction
        Q.setFromAxisAngle(Y_AXIS, -2 * Math.PI * inputComponent.mouse.pan.x * delta * acceleration.y)
        // Apply difference to component direction
        direction.multiply(Q)

        const targetRotation = positionComponent.rotation.clone()

        if (
            inputComponent.input.up.hold
        || inputComponent.input.down.hold
        || inputComponent.input.left.hold
        || inputComponent.input.right.hold
        ) {
            // Reset rotation to face direction
            targetRotation.copy(direction)
        }

        let targetAngle = 0
        if (inputComponent.input.up.hold) {
            if (inputComponent.input.left.hold) {
                targetAngle = Math.PI / 4
            } else if (inputComponent.input.right.hold) {
                targetAngle = Math.PI / -4
            }
        } else if (inputComponent.input.down.hold) {
            targetAngle = Math.PI
            if (inputComponent.input.left.hold) {
                targetAngle = (Math.PI / 4) * 3
            } else if (inputComponent.input.right.hold) {
                targetAngle = (Math.PI / 4) * -3
            }
        } else if (inputComponent.input.left.hold) {
            targetAngle = Math.PI / 2
        } else if (inputComponent.input.right.hold) {
            targetAngle = Math.PI / -2
        }

        Q.setFromAxisAngle(Y_AXIS, targetAngle)
        targetRotation.multiply(Q)

        positionComponent.rotation.slerp(targetRotation, delta * ROTATION_SPEED)

        const forward = new Vector3(0, 0, 1)
        forward.applyQuaternion(direction)
        forward.normalize()
        forward.multiplyScalar(velocity.z * delta)

        const sideways = new Vector3(1, 0, 0)
        sideways.applyQuaternion(direction)
        sideways.normalize()
        sideways.multiplyScalar(velocity.x * delta)

        positionComponent.prevPosition.copy(positionComponent.position)
        positionComponent.position.add(forward)
        positionComponent.position.add(sideways)

        positionComponent.needsUpdate = true
    })
}
