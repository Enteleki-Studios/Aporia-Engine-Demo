import { ComponentManager, HitboxComponent, PositionComponent } from 'gengine'
import { CollidesComponent } from 'dungeon/components'

export function collisionSystem(componentManager: ComponentManager) {
    const solidComponents = componentManager.getTuplesByQueryGeneric<[HitboxComponent, PositionComponent]>(
        ['hitbox', 'position'],
    )

    const movingComponents = componentManager.getTuplesByQueryGeneric<
    [CollidesComponent, HitboxComponent, PositionComponent]
    >(
        ['collides', 'hitbox', 'position'],
    )

    movingComponents.forEach(([, movingHitboxComponent, movingPositionComponent]) => {
        solidComponents.forEach(([solidHitboxComponent, solidPositionComponent]) => {
            if (movingPositionComponent.entityId === solidPositionComponent.entityId) {
                return
            }

            const testDist = movingHitboxComponent.radius + solidHitboxComponent.radius
            const distance = movingPositionComponent.prevPosition.distanceToSquared(solidPositionComponent.position)
            const hasCollision = distance <= testDist ** 2

            if (hasCollision) {
                const movementVector = movingPositionComponent.position.clone()
                movementVector.sub(movingPositionComponent.prevPosition)

                const collisionVector = solidPositionComponent.prevPosition.clone()
                collisionVector.sub(movingPositionComponent.position)

                const movementLength = movementVector.length()
                // movementVector.multiply(collisionVector)
                movementVector.set(-collisionVector.z, collisionVector.y, -collisionVector.x)
                movementVector.normalize()
                movementVector.multiplyScalar(movementLength)
                movementVector.add(movingPositionComponent.prevPosition)

                movingPositionComponent.position.copy(movementVector)
            }
        })
    })
}
