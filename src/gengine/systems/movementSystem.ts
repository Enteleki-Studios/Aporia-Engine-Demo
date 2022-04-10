import { Vector3, Quaternion } from 'three'
import type { ComponentManager } from '../managers/ComponentManager'
import type { PositionComponent } from '../components/PositionComponent'
import type { InputComponent } from '../components/InputComponent'

const decceleration = new Vector3(-5, -0.0001, -5)
const accelerationSetting = new Vector3(15, 0.01, 15)

export function movementSystem(delta: number, componentManager: ComponentManager) {
    componentManager.getTuplesByQueryGeneric<[InputComponent, PositionComponent]>(
        ['input', 'position'],
    ).forEach(([inputComponent, positionComponent]) => {
        const { velocity } = positionComponent
        const frameDeceleration = new Vector3(
            velocity.x * decceleration.x,
            velocity.y * decceleration.y,
            velocity.z * decceleration.z,
        )

        frameDeceleration.multiplyScalar(delta)

        frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(
            Math.abs(frameDeceleration.z),
            Math.abs(velocity.z),
        )

        velocity.add(frameDeceleration)

        const A = new Vector3(0, 1, 0)
        const Q = new Quaternion()

        const acceleration = accelerationSetting.clone()
        if (inputComponent.input.run.hold) {
            acceleration.multiplyScalar(2)
        }

        if (inputComponent.input.up.hold) {
            velocity.z += acceleration.z * delta
        }
        if (inputComponent.input.down.hold) {
            velocity.z -= acceleration.z * delta
        }
        if (inputComponent.input.left.hold) {
            velocity.x += acceleration.x * delta
        }
        if (inputComponent.input.right.hold) {
            velocity.x -= acceleration.x * delta
        }

        const direction = positionComponent.quaternion.clone()

        Q.setFromAxisAngle(A, -2 * Math.PI * inputComponent.mouse.pan.x * delta * acceleration.y)
        direction.multiply(Q)

        positionComponent.quaternion.copy(direction)

        const rotation = positionComponent.rotation.clone()
        if (
            inputComponent.input.up.hold
        || inputComponent.input.down.hold
        || inputComponent.input.left.hold
        || inputComponent.input.right.hold
        ) {
            rotation.copy(direction)
        }

        let nextAngle = 0
        if (inputComponent.input.up.hold) {
            if (inputComponent.input.left.hold) {
                nextAngle = Math.PI / 4
            } else if (inputComponent.input.right.hold) {
                nextAngle = Math.PI / -4
            }
        } else if (inputComponent.input.down.hold) {
            nextAngle = Math.PI
            if (inputComponent.input.left.hold) {
                nextAngle = (Math.PI / 4) * 3
            } else if (inputComponent.input.right.hold) {
                nextAngle = (Math.PI / 4) * -3
            }
        } else if (inputComponent.input.left.hold) {
            nextAngle = Math.PI / 2
        } else if (inputComponent.input.right.hold) {
            nextAngle = Math.PI / -2
        }

        Q.setFromAxisAngle(A, nextAngle)
        rotation.multiply(Q)

        positionComponent.rotation.slerp(rotation, delta * 8)

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
