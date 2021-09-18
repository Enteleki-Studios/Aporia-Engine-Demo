import System from 'ECS/System'
// import logger from 'utils/logger'
import { COLLIDES, LEVEL, POSITION } from 'Components/types'

const hitDistance = 1
const checkRadius = 2

export class Collision extends System {
    tick() {
        const [levelComponent] = this.ECS.ComponentManager.getTuplesByQuery([LEVEL])[0]
        const { tiles } = levelComponent.resource

        this.ECS.ComponentManager.getTuplesByQuery([COLLIDES, POSITION]).forEach(
            ([collisionComponent, positionComponent]) => {
                const { position: { x, z } } = positionComponent
                const currentTile = [Math.floor(x), Math.floor(z)]
                for (let tX = currentTile[0] - checkRadius, mX = currentTile[0] + checkRadius; tX <= mX; tX += 1) {
                    for (let tY = currentTile[1] - checkRadius, mY = currentTile[1] + checkRadius; tY <= mY; tY += 1) {
                        const dx = x - tX
                        const dy = z - tY
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < hitDistance && tiles[tX][tY][0]) {
                            // logger.debug('COLLISION', distance, x, z, tX, tY)
                            collisionComponent.collisions.push(['WALL', tiles[tX][tY][1]])
                        }
                    }
                }
            },
        )
    }
}
