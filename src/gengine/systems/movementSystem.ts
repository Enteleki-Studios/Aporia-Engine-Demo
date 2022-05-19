import { Vector3, Quaternion } from 'three'
import type { ComponentManager } from '../managers/ComponentManager'
import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'
import { InputComponent } from '../components/InputComponent'
import { CameraComponent } from '../components/CameraComponent'
import { Y_AXIS } from '../constants'

const deceleration = new Vector3(-5, -0.0001, -5)
const acceleration = new Vector3(15, 0.01, 15)

const RUN_BOOST = 2
const ROTATION_SPEED = 8

const Q = new Quaternion()

export function movementSystem(delta: number, componentManager: ComponentManager) {
    const cameraComponent = componentManager.getTuplesByClass(CameraComponent)[0][0]

    componentManager.getTuplesByClass(
        InputComponent,
        PositionComponent,
        VelocityComponent,
    ).forEach(([inputComponent, positionComponent, velocityComponent]) => {
        const { direction } = cameraComponent
        const { velocity } = velocityComponent

        // Calculate deceleration
        const frameDeceleration = velocity.clone().multiply(deceleration).multiplyScalar(delta)

        // Calculate acceleration
        // TODO diagonal movement shouldn't be faster
        const frameAcceleration = new Vector3()
        if (inputComponent.input.up.hold) {
            frameAcceleration.z += acceleration.z
        }
        if (inputComponent.input.down.hold) {
            frameAcceleration.z -= acceleration.z
        }
        if (inputComponent.input.left.hold) {
            frameAcceleration.x += acceleration.x
        }
        if (inputComponent.input.right.hold) {
            frameAcceleration.x -= acceleration.x
        }

        const boost = inputComponent.input.run.hold ? RUN_BOOST : 1
        frameAcceleration.multiplyScalar(delta)
        frameAcceleration.setLength(frameAcceleration.length() * boost)

        // Apply acceleration to velocity
        const forward = new Vector3(0, 0, 1)
        forward.applyQuaternion(direction)
        forward.normalize()
        forward.multiplyScalar(frameAcceleration.z)

        const sideways = new Vector3(1, 0, 0)
        sideways.applyQuaternion(direction)
        sideways.normalize()
        sideways.multiplyScalar(frameAcceleration.x)

        velocity.add(frameDeceleration)
        velocity.add(forward)
        velocity.add(sideways)

        // Rotate model to match input
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
    })
}
