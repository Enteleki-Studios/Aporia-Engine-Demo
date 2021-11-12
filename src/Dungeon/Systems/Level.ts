import * as ROT from 'rot-js'
import { Vector2 } from 'three'
import { System } from 'ECS'
import { LEVEL, MODEL, POSITION } from '../Components/types'
import type { Position, Level as LevelComponent } from '../Components'

export class Level extends System {
    display: ROT.Display
    mapSize: [number, number]

    constructor({ size }: { size: [number, number] }) {
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

        const debugCanvas = <HTMLElement>display.getContainer()
        // const mapScale = 6

        debugCanvas.id = 'mapCanvas'
        // debugCanvas.style = `width: ${this.mapSize[0] * mapScale}px; height: ${this.mapSize[0] * mapScale}px`
        document.getElementById('map')!.append(debugCanvas)

        return display
    }

    _createMap(seed: number) {
        ROT.RNG.setSeed(seed)

        const map = new ROT.Map.Digger(this.mapSize[0], this.mapSize[1], {
            roomWidth: [5, 25],
            roomHeight: [5, 25],
            corridorLength: [3, 5],
            dugPercentage: 0.3,
        })

        const tiles: [number, Vector2?][][] = []
        map.create((x, y, isWall) => {
            if (!y) {
                tiles[x * 2] = []
                tiles[x * 2 + 1] = []
            }
            tiles[x * 2][y * 2] = [isWall]
            tiles[x * 2][y * 2 + 1] = [isWall]
            tiles[x * 2 + 1][y * 2] = [isWall]
            tiles[x * 2 + 1][y * 2 + 1] = [isWall]
            this.display.DEBUG(x, y, isWall)
        })

        for (let x = 0, maxX = tiles.length; x < maxX; x += 1) {
            for (let y = 0, maxY = tiles[0].length; y < maxY; y += 1) {
                const isFloor = !tiles[x][y][0]
                if (isFloor) {
                    if (tiles[x][y - 1][0]) {
                        if (!tiles[x][y - 1][1]) {
                            tiles[x][y - 1].push(new Vector2(0, 0))
                        }
                        tiles[x][y - 1][1]!.add(new Vector2(0, 1))
                    }
                    if (tiles[x][y + 1][0]) {
                        if (!tiles[x][y + 1][1]) {
                            tiles[x][y + 1].push(new Vector2(0, 0))
                        }
                        tiles[x][y + 1][1]!.add(new Vector2(0, -1))
                    }
                    if (tiles[x - 1][y][0]) {
                        if (!tiles[x - 1][y][1]) {
                            tiles[x - 1][y].push(new Vector2(0, 0))
                        }
                        tiles[x - 1][y][1]!.add(new Vector2(1, 0))
                    }
                    if (tiles[x + 1][y][0]) {
                        if (!tiles[x + 1][y][1]) {
                            tiles[x + 1][y].push(new Vector2(0, 0))
                        }
                        tiles[x + 1][y][1]!.add(new Vector2(-1, 0))
                    }
                }
            }
        }
        // const rooms = map.getRooms()
        // const [x, z] = rooms[0].getCenter()
        // map.tiles = tiles
        // return map
        return { tiles }
    }

    tick() {
        const levelComponents = (this.ECS.ComponentManager.getTuplesByQuery([LEVEL]) as unknown) as LevelComponent[]
        if (levelComponents && levelComponents[0] && !levelComponents[0].resource) {
            levelComponents[0].resource = this._createMap(levelComponents[0].seed)
        }

        this.ECS.ComponentManager.getTuplesByQuery([MODEL, POSITION]).forEach(
            ([, positionComponent]) => {
                const { position: { x, z } } = positionComponent as Position
                this.display.draw(Math.floor(x / 2), Math.floor(z / 2), '', '', '#cd00cd')
            },
        )
    }
}
