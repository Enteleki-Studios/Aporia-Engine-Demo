import { Vector3, Vector2 } from 'three'
import { System } from '../ECS/System'
import { ECSFilter } from '../ECS/ECSFilter'
import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'
import { InputComponent } from '../components/InputComponent'
import { CameraComponent } from '../components/CameraComponent'
import { Y_AXIS } from '../constants'
import { World } from '../World'

const deceleration = new Vector3(-5, -0.0001, -5)

const RUN_BOOST = 2
const BASE_SPEED = 15

export class MovementSystem extends System {
    cameraFilter = new ECSFilter([CameraComponent])
    movementFilter = new ECSFilter([InputComponent, PositionComponent, VelocityComponent])

    filters = [this.cameraFilter, this.movementFilter]

    tick(world: World) {
        const [cameraEntity] = this.cameraFilter.entities
        const delta = world.timeElapsedS

        this.movementFilter.entities.forEach((entity) => {
            const inputComponent = entity.get(InputComponent)
            const positionComponent = entity.get(PositionComponent)
            const velocityComponent = entity.get(VelocityComponent)

            const { position: camPosition } = cameraEntity.get(CameraComponent)
            const cameraDirection = new Vector3().subVectors(camPosition, positionComponent.position)
            const { velocity } = velocityComponent

            // Calculate deceleration
            const frameDeceleration = velocity.clone().multiply(deceleration).multiplyScalar(delta)

            // Accelerate away from the camera
            const frameAcceleration = cameraDirection.clone().setY(0).negate().normalize()

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

            // Character rotation
            const { x, y } = entity.get(InputComponent).mouse.position.centerRel
            let angle = new Vector2(x, y).negate().angle()

            const camDirection = new Vector3().subVectors(camPosition, positionComponent.position)
            const camPos = new Vector2(camDirection.x, camDirection.z).angle()

            angle -= camPos
            positionComponent.rotation.setFromAxisAngle(Y_AXIS, angle)
        })
    }
}
