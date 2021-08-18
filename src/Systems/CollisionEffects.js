import System from 'ECS/System'
import { COLLIDES, POSITION } from 'Components/types'

export class CollisionEffects extends System {
    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([COLLIDES, POSITION]).forEach(
            ([collisionComponent, positionComponent]) => {
                const { position, prevPosition } = positionComponent
                if (collisionComponent.collisions.length) {
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
                }
            },
        )
    }
}
