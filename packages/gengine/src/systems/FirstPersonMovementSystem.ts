import { ECSFilter, System } from '../ecs'
// import { roundToZero } from '../utils/vectorUtils'
import { DirectionComponent, InputComponent, VelocityComponent } from '../components'
import { ORIGIN } from '../constants'
import { World } from '../World'
import { Vec3 } from 'gl-matrix/dist/esm'

const DECELERATION = -5

const RUN_BOOST = 2
const BASE_SPEED = 15

const frameDeceleration = new Vec3()
const frameAcceleration = new Vec3()

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
            // const frameDeceleration = velocity.clone().multiplyScalar(DECELERATION).multiplyScalar(delta)
            frameDeceleration.copy(velocity).scale(DECELERATION).scale(delta)

            Vec3.copy(frameAcceleration, direction)
            frameAcceleration.y = 0
            frameAcceleration.normalize()

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
                frameAcceleration.scale(0)
            }

            // Rotate acceleration in the direction of travel
            Vec3.rotateY(frameAcceleration, frameAcceleration, ORIGIN, targetAngle)

            // Set acceleration magnitude
            const boost = inputComponent.input.run.hold ? RUN_BOOST : 1
            frameAcceleration.scale(BASE_SPEED * boost * delta)

            Vec3.add(velocity, velocity, frameDeceleration)
            Vec3.add(velocity, velocity, frameAcceleration)
            // roundToZero(velocity)

            Vec3.rotateY(direction, direction, ORIGIN, -inputComponent.mouse.pan.x * delta * 0.1)
            direction[1] -= inputComponent.mouse.pan.y * delta * 0.1
        })
    }
}
