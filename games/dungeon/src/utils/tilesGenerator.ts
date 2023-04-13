import * as ROT from 'rot-js'
import { Vector2 } from 'three'

export type Tiles = [number, Vector2?][][]

export default (size: [number, number], seed: number) => {
    ROT.RNG.setSeed(seed)

    const map = new ROT.Map.Digger(size[0], size[1], {
        roomWidth: [5, 25],
        roomHeight: [5, 25],
        corridorLength: [3, 5],
        dugPercentage: 0.3,
    })

    const tiles: Tiles = []
    map.create((x, y, isWall) => {
        if (!y) {
            tiles[x * 2] = []
            tiles[x * 2 + 1] = []
        }
        tiles[x * 2][y * 2] = [isWall]
        tiles[x * 2][y * 2 + 1] = [isWall]
        tiles[x * 2 + 1][y * 2] = [isWall]
        tiles[x * 2 + 1][y * 2 + 1] = [isWall]
    })

    for (let x = 0, maxX = tiles.length; x < maxX; x += 1) {
        for (let y = 0, maxY = tiles[0].length; y < maxY; y += 1) {
            const isFloor = !tiles[x][y][0]
            if (isFloor) {
                if (tiles[x][y - 1][0]) {
                    if (!tiles[x][y - 1][1]) {
                        tiles[x][y - 1].push(new Vector2(0, 0))
                    }
                    tiles[x][y - 1][1]?.add(new Vector2(0, 1))
                }
                if (tiles[x][y + 1][0]) {
                    if (!tiles[x][y + 1][1]) {
                        tiles[x][y + 1].push(new Vector2(0, 0))
                    }
                    tiles[x][y + 1][1]?.add(new Vector2(0, -1))
                }
                if (tiles[x - 1][y][0]) {
                    if (!tiles[x - 1][y][1]) {
                        tiles[x - 1][y].push(new Vector2(0, 0))
                    }
                    tiles[x - 1][y][1]?.add(new Vector2(1, 0))
                }
                if (tiles[x + 1][y][0]) {
                    if (!tiles[x + 1][y][1]) {
                        tiles[x + 1][y].push(new Vector2(0, 0))
                    }
                    tiles[x + 1][y][1]?.add(new Vector2(-1, 0))
                }
            }
        }
    }
    return tiles
}
