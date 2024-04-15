import { Vec3 } from 'gl-matrix'
import { createSystem, type World } from 'core'
import { cameraComponent, directionComponent, inputComponent, transform3D, velocityComponent } from 'components'
import { Array3, ORIGIN } from 'definitions'
import { cameraFilter, movingEntitiesFilter, rotatingEntitiesFilter, inputFilter } from 'filters'
import { /* angle2, */ roundToZero } from 'utils/vectorUtils'

export const twinStickMovementFilter = inputFilter.and(movingEntitiesFilter).and(rotatingEntitiesFilter)

export const twinStickMovementSystem = createSystem('twin-stick movement', () => {
    // Constants
    const RUN_BOOST = 2
    const BASE_SPEED = 15
    const deceleration: Array3 = [-5, -0.0001, -5]

    // Reused
    const cameraDirection: Array3 = [0, 0, 0]
    const frameDeceleration: Array3 = [0, 0, 0]
    const frameAcceleration: Array3 = [0, 0, 0]
    // const charAngleVector: Array2 = [0, 0]
    // const camAngleVector: Array2 = [0, 0]

    return (world: World) => {
        const delta = world.timeElapsedS
        for (const cameraEntity of world.ecs.filterBy(cameraFilter)) {
            for (const entity of world.ecs.filterBy(twinStickMovementFilter)) {
                const { input, mouse } = entity.get(inputComponent)
                const { position } = entity.get(transform3D)
                const { velocity } = entity.get(velocityComponent)

                const { position: camPosition } = cameraEntity.get(cameraComponent)
                Vec3.sub(cameraDirection, camPosition, position)

                // Calculate deceleration
                Vec3.multiply(frameDeceleration, velocity, deceleration)
                Vec3.scale(frameDeceleration, frameDeceleration, delta)

                // Accelerate away from the camera
                Vec3.copy(frameAcceleration, cameraDirection)
                frameAcceleration[1] = 0
                Vec3.negate(frameAcceleration, frameAcceleration)
                Vec3.normalize(frameAcceleration, frameAcceleration)

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
                    Vec3.zero(frameAcceleration)
                }

                // Rotate acceleration in the direction of travel
                Vec3.rotateY(frameAcceleration, frameAcceleration, ORIGIN, targetAngle)

                // Set acceleration magnitude
                const boost = input.run.hold ? RUN_BOOST : 1
                Vec3.scale(frameAcceleration, frameAcceleration, BASE_SPEED * boost * delta)

                Vec3.add(velocity, velocity, frameDeceleration)
                Vec3.add(velocity, velocity, frameAcceleration)
                roundToZero(velocity, velocity)

                // Character rotation
                const { direction } = entity.get(directionComponent)
                // Rotate with velocity
                if (Vec3.squaredLength(frameAcceleration)) {
                    Vec3.copy(direction, velocity)
                    direction[1] = 0
                    Vec3.normalize(direction, direction)
                }

                // Rotate towards cursor (in progress)
                // const { x, y } = mouse.position.centerRel

                // Vec2.set(charAngleVector, x, y)
                // Vec2.negate(charAngleVector, charAngleVector)

                // Vec2.set(camAngleVector, cameraDirection[0], cameraDirection[2])

                // const angle = angle2(charAngleVector) - angle2(camAngleVector) + Math.PI / 2

                // Vec3.set(direction, 1, 0, 0)
                // Vec3.rotateY(direction, direction, ORIGIN, angle)
            }
        }
    }
})
