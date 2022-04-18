import { ComponentManager, HitboxComponent, PositionComponent, VelocityComponent } from 'gengine'
import { CollidesComponent } from 'dungeon/components'
import { Vector3 } from 'three'

const Y_AXIS = new Vector3(0, 1, 0)

export function collisionSystem(delta: number, componentManager: ComponentManager) {
    const solidComponents = componentManager.getTuplesByQueryGeneric<[HitboxComponent, PositionComponent]>(
        ['hitbox', 'position'],
    )

    const movingComponents = componentManager.getTuplesByQueryGeneric<
    [CollidesComponent, HitboxComponent, PositionComponent, VelocityComponent]
    >(
        ['collides', 'hitbox', 'position', 'velocity'],
    )

    movingComponents.forEach(([, movingHitboxComponent, movingPositionComponent, movingVelocityComponent]) => {
        solidComponents.forEach(([solidHitboxComponent, solidPositionComponent]) => {
            // No self collision
            if (movingPositionComponent.entityId === solidPositionComponent.entityId) {
                return
            }

            const movementVector = movingVelocityComponent.velocity.clone()

            // Minimum distance
            const testDist = (movingHitboxComponent.radius + solidHitboxComponent.radius) ** 2
            // Distance between next position and solid object
            const nextPosition = movingPositionComponent.position.clone().add(
                movementVector.clone().multiplyScalar(delta),
            )
            const distance = nextPosition.distanceToSquared(solidPositionComponent.position)

            if (distance <= testDist) {
                const collisionVector = movingPositionComponent.position.clone()
                collisionVector.sub(solidPositionComponent.position)
                // Rotate 90 degrees to get tangent vector
                collisionVector.applyAxisAngle(Y_AXIS, -Math.PI / 2)

                movementVector.projectOnVector(collisionVector)

                movingVelocityComponent.velocity.copy(movementVector)
            }
        })
    })
}
