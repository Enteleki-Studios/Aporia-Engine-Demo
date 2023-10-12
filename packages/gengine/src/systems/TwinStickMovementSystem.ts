import { Vector2 } from 'three'
import { Vec3 } from 'gl-matrix/dist/esm'
import { createSystem } from 'ecs'
import { cameraComponent, directionComponent, inputComponent, positionComponent, velocityComponent } from 'components'
import { ORIGIN } from 'definitions'
import type { World } from 'World'
import { cameraFilter, movingEntitiesFilter, rotatingEntitiesFilter, inputFilter } from 'filters'

const deceleration = new Vec3(-5, -0.0001, -5)

const RUN_BOOST = 2
const BASE_SPEED = 15

export const twinStickMovementFilter = inputFilter.and(movingEntitiesFilter).and(rotatingEntitiesFilter)

export const twinStickMovementSystem = createSystem('twin-stick movement', () => (world: World) => {
    const delta = world.timeElapsedS
    world.ecs.filterBy(cameraFilter).forEach((cameraEntity) => {
        world.ecs.filterBy(twinStickMovementFilter).forEach((entity) => {
            const { input } = entity.get(inputComponent)
            const { position } = entity.get(positionComponent)
            const { velocity } = entity.get(velocityComponent)

            const { position: camPosition } = cameraEntity.get(cameraComponent)
            const cameraDirection = Vec3.sub(new Vec3(), camPosition, position)

            // Calculate deceleration
            const frameDeceleration = Vec3.multiply(new Vec3(), velocity, deceleration)
            Vec3.scale(frameDeceleration, frameDeceleration, delta)

            // Accelerate away from the camera
            const frameAcceleration = new Vec3(cameraDirection)
            frameAcceleration.y = 0
            frameAcceleration.negate().normalize()

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

            // Character rotation
            const { x, y } = entity.get(inputComponent).mouse.position.centerRel
            let angle = new Vector2(x, y).negate().angle()

            const camPos = new Vector2(cameraDirection[0], cameraDirection[2]).angle()

            angle -= camPos

            const { direction } = entity.get(directionComponent)
            Vec3.set(direction, 0, 0, 1)
            Vec3.rotateY(direction, direction, ORIGIN, angle)
        })
    })
})
