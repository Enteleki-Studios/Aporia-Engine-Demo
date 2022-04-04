import { Vector3, Quaternion } from 'three'
import type { ComponentManager } from '../managers/ComponentManager'
import type { PositionComponent } from '../components/PositionComponent'
import type { InputComponent } from '../components/InputComponent'

const _decceleration = new Vector3(-5, -0.0001, -5)
const _acceleration = new Vector3(15, 0.01, 15)

export const movementSystem = (delta: number, componentManager: ComponentManager) => {
    componentManager.getTuplesByQueryGeneric<[InputComponent, PositionComponent]>(
        ['input', 'position'],
    ).forEach(([inputComponent, positionComponent]) => {
        const { velocity } = positionComponent
        const frameDecceleration = new Vector3(
            velocity.x * _decceleration.x,
            velocity.y * _decceleration.y,
            velocity.z * _decceleration.z,
        )

        frameDecceleration.multiplyScalar(delta)
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z),
            Math.abs(velocity.z),
        )

        velocity.add(frameDecceleration)

        const _A = new Vector3(0, 1, 0)
        const _Q = new Quaternion()
        const _D = positionComponent.quaternion.clone()
        const _R = positionComponent.rotation.clone()

        const acceleration = _acceleration.clone()
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

        // _Q.setFromAxisAngle(_A, -2 * Math.PI * inputComponent.pan.x * delta * acceleration.y)
        _D.multiply(_Q)

        positionComponent.quaternion.copy(_D)

        if (
            inputComponent.input.up.hold
        || inputComponent.input.down.hold
        || inputComponent.input.left.hold
        || inputComponent.input.right.hold
        ) {
            _R.copy(_D)
        }

        let nextAngle = 0
        if (inputComponent.input.up.hold) {
            if (inputComponent.input.left.hold) {
                nextAngle = Math.PI / 4
            } else if (inputComponent.input.right.hold) {
                nextAngle = Math.PI / -4
            }
        } else if (inputComponent.input.down.hold) {
            if (inputComponent.input.left.hold) {
                nextAngle = Math.PI / -4
            } else if (inputComponent.input.right.hold) {
                nextAngle = Math.PI / 4
            }
        } else if (inputComponent.input.left.hold) {
            nextAngle = Math.PI / 2
        } else if (inputComponent.input.right.hold) {
            nextAngle = Math.PI / -2
        }
        _Q.setFromAxisAngle(_A, nextAngle)
        _R.multiply(_Q)

        positionComponent.rotation.slerp(_R, delta * 8)

        const forward = new Vector3(0, 0, 1)
        forward.applyQuaternion(_D)
        forward.normalize()
        forward.multiplyScalar(velocity.z * delta)

        const sideways = new Vector3(1, 0, 0)
        sideways.applyQuaternion(_D)
        sideways.normalize()
        sideways.multiplyScalar(velocity.x * delta)

        positionComponent.prevPosition.copy(positionComponent.position)
        positionComponent.position.add(forward)
        positionComponent.position.add(sideways)

        positionComponent.needsUpdate = true
    })
}
