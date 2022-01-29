import { System } from 'gengine'
// import logger from 'utils/logger'
import { COLLISION, LEVEL, POSITION } from 'components/types'
import type {
    CollisionComponent,
    LevelComponent,
    PositionComponent,
} from 'components'

const hitDistance = 1
const checkRadius = 2

export class Collision extends System {
    tick() {
        const [levelComponent] = this.ECS.ComponentManager.getTuplesByQuery([LEVEL])[0] as [LevelComponent]
        const { tiles } = levelComponent

        this.ECS.ComponentManager.getTuplesByQuery([COLLISION, POSITION]).forEach((tuple) => {
            const [collisionComponent, positionComponent] = tuple as [CollisionComponent, PositionComponent]
            const { position: { x, z } } = positionComponent
            const currentTile = [Math.floor(x), Math.floor(z)]
            for (let tX = currentTile[0] - checkRadius, mX = currentTile[0] + checkRadius; tX <= mX; tX += 1) {
                for (let tY = currentTile[1] - checkRadius, mY = currentTile[1] + checkRadius; tY <= mY; tY += 1) {
                    const dx = x - tX
                    const dy = z - tY
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    const collisionVector = tiles[tX][tY][1]
                    if (distance < hitDistance && collisionVector) {
                        // logger.debug('COLLISION', distance, x, z, tX, tY)
                        collisionComponent.collisions.push(['WALL', collisionVector])
                    }
                }
            }
        })
    }
}
