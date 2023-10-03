import { Vector2 } from 'three'
import { Vec3 } from 'gl-matrix/dist/esm'
import { ECSFilter, System } from 'ecs'
import { cameraComponent, directionComponent, inputComponent, positionComponent, velocityComponent } from 'components'
import { ORIGIN } from 'definitions'
import { World } from 'World'

const deceleration = new Vec3(-5, -0.0001, -5)

const RUN_BOOST = 2
const BASE_SPEED = 15

export class TwinStickMovementSystem implements System {
    cameraFilter = new ECSFilter([cameraComponent])
    movementFilter = new ECSFilter([directionComponent, inputComponent, positionComponent, velocityComponent])

    filters = [this.cameraFilter, this.movementFilter]

    tick(world: World) {
        const [cameraEntity] = this.cameraFilter.entities
        const delta = world.timeElapsedS

        this.movementFilter.entities.forEach((entity) => {
            const inputComponent = entity.get(InputComponent)
            const positionComponent = entity.get(PositionComponent)
            const velocityComponent = entity.get(VelocityComponent)

            const { position: camPosition } = cameraEntity.get(CameraComponent)
            const cameraDirection = Vec3.sub(new Vec3(), camPosition, positionComponent.position)
            const { velocity } = velocityComponent

            // Calculate deceleration
            const frameDeceleration = Vec3.multiply(new Vec3(), velocity, deceleration)
            Vec3.scale(frameDeceleration, frameDeceleration, delta)

            // Accelerate away from the camera
            const frameAcceleration = new Vec3(cameraDirection)
            frameAcceleration.y = 0
            frameAcceleration.negate().normalize()

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
                Vec3.zero(frameAcceleration)
            }

            // Rotate acceleration in the direction of travel
            Vec3.rotateY(frameAcceleration, frameAcceleration, ORIGIN, targetAngle)

            // Set acceleration magnitude
            const boost = inputComponent.input.run.hold ? RUN_BOOST : 1
            Vec3.scale(frameAcceleration, frameAcceleration, BASE_SPEED * boost * delta)

            Vec3.add(velocity, velocity, frameDeceleration)
            Vec3.add(velocity, velocity, frameAcceleration)

            // Character rotation
            const { x, y } = entity.get(InputComponent).mouse.position.centerRel
            let angle = new Vector2(x, y).negate().angle()

            const camPos = new Vector2(cameraDirection[0], cameraDirection[2]).angle()

            angle -= camPos

            const { direction } = entity.get(DirectionComponent)
            Vec3.set(direction, 0, 0, 1)
            Vec3.rotateY(direction, direction, ORIGIN, angle)
        })
    }
}
