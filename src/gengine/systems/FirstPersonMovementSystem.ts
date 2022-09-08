import { Vector3, Quaternion } from 'three'
import { System } from '../ECS/System'
import { ECSFilter } from '../ECS/ECSFilter'
import { roundToZero } from '../utils/vectorUtils'
import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'
import { InputComponent } from '../components/InputComponent'
import { Y_AXIS, X_AXIS } from '../constants'
import { World } from '../World'

const DECELERATION = -5

const RUN_BOOST = 2
const BASE_SPEED = 15

export class FirstPersonMovementSystem extends System {
    movementFilter = new ECSFilter([InputComponent, PositionComponent, VelocityComponent])

    filters = [this.movementFilter]

    tick(world: World) {
        const delta = world.timeElapsedS

        this.movementFilter.entities.forEach((entity) => {
            const inputComponent = entity.get(InputComponent)
            const positionComponent = entity.get(PositionComponent)
            const velocityComponent = entity.get(VelocityComponent)

            const characterDirection = new Vector3(0, 0, 1).applyQuaternion(positionComponent.rotation)
            const { velocity } = velocityComponent

            // Calculate deceleration
            const frameDeceleration = velocity.clone().multiplyScalar(DECELERATION).multiplyScalar(delta)

            const frameAcceleration = characterDirection.clone().setY(0).normalize()

            let targetAngle = 0
            if (inputComponent.input.up.hold) {
                if (inputComponent.input.left.hold) {
                    targetAngle = Math.PI / 4
                } else if (inputComponent.input.right.hold) {
                    targetAngle = Math.PI / -4
                }
            } else if (inputComponent.input.down.hold) {
                if (inputComponent.input.left.hold) {
                    targetAngle = (Math.PI / 4) * 3
                } else if (inputComponent.input.right.hold) {
                    targetAngle = (Math.PI / 4) * -3
                } else {
                    targetAngle = Math.PI
                }
            } else if (inputComponent.input.left.hold) {
                targetAngle = Math.PI / 2
            } else if (inputComponent.input.right.hold) {
                targetAngle = Math.PI / -2
            } else {
                // No input, no acceleration
                frameAcceleration.multiplyScalar(0)
            }

            // Rotate acceleration in the direction of travel
            frameAcceleration.applyAxisAngle(Y_AXIS, targetAngle)

            // Set acceleration magnitude
            const boost = inputComponent.input.run.hold ? RUN_BOOST : 1
            frameAcceleration.multiplyScalar(BASE_SPEED * boost * delta)

            velocity.add(frameDeceleration).add(frameAcceleration)
            roundToZero(velocity)

            // Character rotation
            const panQHorizontal = new Quaternion().setFromAxisAngle(
                Y_AXIS,
                -2 * Math.PI * inputComponent.mouse.pan.x * delta * 0.01,
            )

            const panQVertical = new Quaternion().setFromAxisAngle(
                X_AXIS,
                2 * Math.PI * inputComponent.mouse.pan.y * delta * 0.01,
            )

            positionComponent.rotation.multiply(panQHorizontal).multiply(panQVertical)
        })
    }
}
