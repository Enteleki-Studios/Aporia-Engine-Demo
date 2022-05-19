import { ComponentManager, HitboxComponent, PositionComponent, VelocityComponent, Y_AXIS } from 'gengine'
import { CollidesComponent } from 'dungeon/components'

export function collisionSystem(delta: number, componentManager: ComponentManager) {
    const solidComponents = componentManager.getTuplesByClass(HitboxComponent, PositionComponent)

    const movingComponents = componentManager.getTuplesByClass(
        CollidesComponent,
        HitboxComponent,
        PositionComponent,
        VelocityComponent,
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
