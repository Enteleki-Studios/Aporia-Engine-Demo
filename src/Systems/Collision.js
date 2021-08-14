import System from 'ECS/System'
import { COLLIDES, LEVEL, POSITION } from 'Components/types'

export class Collision extends System {
    tick() {
        const [levelComponent] = this.ECS.ComponentManager.getTuplesByQuery([LEVEL])[0]
        const { tiles } = levelComponent.resource

        this.ECS.ComponentManager.getTuplesByQuery([COLLIDES, POSITION]).forEach(
            ([collisionComponent, positionComponent]) => {
                const { position: { x, z } } = positionComponent
                if (tiles[Math.floor(x / 2)][Math.floor(z / 2)]) {
                    console.debug('COLLISION')
                }
            },
        )
    }
}
