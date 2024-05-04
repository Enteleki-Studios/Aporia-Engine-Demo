// import { roundToZero } from '../utils/vectorUtils'
import { directionComponent, inputComponent, velocityComponent } from 'components'
import { type World, createSystem } from 'core'
import { ORIGIN } from 'definitions'
import { inputFilter, movingEntitiesFilter, rotatingEntitiesFilter } from 'filters'

import { Vec3 } from 'gl-matrix'

const DECELERATION = -5

const RUN_BOOST = 2
const BASE_SPEED = 15

const frameDeceleration = new Vec3()
const frameAcceleration = new Vec3()

export const firstPersonMovementFilter = inputFilter.and(movingEntitiesFilter).and(rotatingEntitiesFilter)

export const firstPersonMovementSystem = createSystem('first-person movement', () => (world: World) => {
    const delta = world.timeElapsedS

    world.ecs.filterBy(firstPersonMovementFilter).forEach((entity) => {
        const { input, mouse } = entity.get(inputComponent)
        const { velocity } = entity.get(velocityComponent)
        const { direction } = entity.get(directionComponent)

        // Calculate deceleration
        // const frameDeceleration = velocity.clone().multiplyScalar(DECELERATION).multiplyScalar(delta)
        frameDeceleration.copy(velocity).scale(DECELERATION).scale(delta)

        Vec3.copy(frameAcceleration, direction)
        frameAcceleration.y = 0
        frameAcceleration.normalize()

        let targetAngle = 0
        if (input.up.hold) {
            if (input.left.hold) {
                targetAngle = Math.PI / 4
            } else if (input.right.hold) {
                targetAngle = Math.PI / -4
            }
        } else if (input.down.hold) {
            if (input.left.hold) {
                targetAngle = (Math.PI / 4) * 3
            } else if (input.right.hold) {
                targetAngle = (Math.PI / 4) * -3
            } else {
                targetAngle = Math.PI
            }
        } else if (input.left.hold) {
            targetAngle = Math.PI / 2
        } else if (input.right.hold) {
            targetAngle = Math.PI / -2
        } else {
            // No input, no acceleration
            frameAcceleration.scale(0)
        }

        // Rotate acceleration in the direction of travel
        Vec3.rotateY(frameAcceleration, frameAcceleration, ORIGIN, targetAngle)

        // Set acceleration magnitude
        const boost = input.run.hold ? RUN_BOOST : 1
        frameAcceleration.scale(BASE_SPEED * boost * delta)

        Vec3.add(velocity, velocity, frameDeceleration)
        Vec3.add(velocity, velocity, frameAcceleration)
        // roundToZero(velocity)

        Vec3.rotateY(direction, direction, ORIGIN, -mouse.pan.x * delta * 0.1)
        direction[1] -= mouse.pan.y * delta * 0.1
    })
})
