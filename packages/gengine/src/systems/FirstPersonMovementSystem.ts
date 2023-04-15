import { ECSFilter, System } from '../ecs'
import { roundToZero } from '../utils/vectorUtils'
import { DirectionComponent, InputComponent, VelocityComponent } from '../components'
import { Y_AXIS } from '../constants'
import { World } from '../World'

const DECELERATION = -5

const RUN_BOOST = 2
const BASE_SPEED = 15

export class FirstPersonMovementSystem implements System {
    movementFilter = new ECSFilter([DirectionComponent, InputComponent, VelocityComponent])

    filters = [this.movementFilter]

    tick(world: World) {
        const delta = world.timeElapsedS

        this.movementFilter.entities.forEach((entity) => {
            const inputComponent = entity.get(InputComponent)
            const { velocity } = entity.get(VelocityComponent)
            const { direction } = entity.get(DirectionComponent)

            // Calculate deceleration
            const frameDeceleration = velocity.clone().multiplyScalar(DECELERATION).multiplyScalar(delta)

            const frameAcceleration = direction.clone().setY(0).normalize()

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

            direction.applyAxisAngle(Y_AXIS, -inputComponent.mouse.pan.x * delta * 0.1)
            direction.y -= inputComponent.mouse.pan.y * delta * 0.1
        })
    }
}
