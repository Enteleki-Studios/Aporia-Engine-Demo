import * as ROT from 'rot-js'
import System from 'ECS/System'
import { LEVEL, MODEL, POSITION } from 'Components/types'

export class Level extends System {
    constructor({ size }) {
        super()
        this.mapSize = size

        this.display = this._createDisplay()
    }

    _createDisplay() {
        const display = new ROT.Display({
            width: this.mapSize[0],
            height: this.mapSize[1],
            fontSize: 1,
            fg: '#fff',
            bg: '#000',
        })

        const debugCanvas = display.getContainer()
        const mapScale = 6

        debugCanvas.id = 'mapCanvas'
        debugCanvas.style = `width: ${this.mapSize[0] * mapScale}px; height: ${this.mapSize[0] * mapScale}px`
        document.getElementById('debug').append(debugCanvas)

        return display
    }

    _createMap(seed) {
        ROT.RNG.setSeed(seed)

        const map = new ROT.Map.Digger(this.mapSize[0], this.mapSize[1], {
            roomWidth: [5, 25],
            roomHeight: [5, 25],
            corridorLength: [3, 5],
            dugPercentage: 0.3,
        })

        const tiles = []
        map.create((x, y, isWall) => {
            if (!y) {
                tiles[x] = []
            }
            tiles[x][y] = isWall
            this.display.DEBUG(x, y, isWall)
        })
        // const rooms = map.getRooms()
        // const [x, z] = rooms[0].getCenter()
        map.tiles = tiles
        return map
    }

    tick() {
        const [levelComponent] = this.ECS.ComponentManager.getTuplesByQuery([LEVEL])[0]
        if (!levelComponent.resource) {
            levelComponent.resource = this._createMap(levelComponent.seed)
        }

        this.ECS.ComponentManager.getTuplesByQuery([MODEL, POSITION]).forEach(
            ([, positionComponent]) => {
                const { position: { x, z } } = positionComponent
                this.display.draw(Math.floor(x / 2), Math.floor(z / 2), '', '', '#cd00cd')
            },
        )
    }
}
