import { System } from 'gengine'
import { COLLISION, POSITION } from 'components/types'
import type { CollisionComponent, PositionComponent } from 'components'

export class CollisionEffects extends System {
    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([COLLISION, POSITION]).forEach((tuple) => {
            const [collisionComponent, positionComponent] = tuple as [CollisionComponent, PositionComponent]
            const { position, prevPosition } = positionComponent
            if (collisionComponent.collisions.length) {
                collisionComponent.numCollisions = collisionComponent.collisions.length
                collisionComponent.collisions.forEach((collision) => {
                    const wallNormal = collision[1]
                    const xCollision = (position.x - prevPosition.x) * wallNormal.x
                    const yCollision = (position.z - prevPosition.z) * wallNormal.y
                    if (xCollision < 0) {
                        position.x = prevPosition.x
                    }
                    if (yCollision < 0) {
                        position.z = prevPosition.z
                    }
                })
                collisionComponent.collisions = []
            } else {
                collisionComponent.numCollisions = 0
            }
        })
    }
}
