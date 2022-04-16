import { ComponentManager, HitboxComponent, PositionComponent } from 'gengine'
import { CollidesComponent } from 'dungeon/components'
import { Vector3 } from 'three'

const Y_AXIS = new Vector3(0, 1, 0)

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
            // No self collision
            if (movingPositionComponent.entityId === solidPositionComponent.entityId) {
                return
            }

            // Minimum distance
            const testDist = (movingHitboxComponent.radius + solidHitboxComponent.radius) ** 2
            // Distance between next position and solid object
            const distance = movingPositionComponent.position.distanceToSquared(solidPositionComponent.position)

            if (distance <= testDist) {
                const movementVector = movingPositionComponent.position.clone()
                movementVector.sub(movingPositionComponent.prevPosition)

                const collisionVector = movingPositionComponent.prevPosition.clone()
                collisionVector.sub(solidPositionComponent.position)
                // Rotate 90 degrees to get tangent vector
                collisionVector.applyAxisAngle(Y_AXIS, -Math.PI / 2)

                movementVector.projectOnVector(collisionVector)
                movementVector.add(movingPositionComponent.prevPosition)

                movingPositionComponent.position.copy(movementVector)
            }
        })
    })
}
