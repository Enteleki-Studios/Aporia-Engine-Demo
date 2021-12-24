import { Component } from 'ECS'
import type { Tiles } from 'utils/tilesGenerator'
import { LEVEL } from './types'

export class Level extends Component {
    type = LEVEL
    readonly tiles: Tiles

    constructor(entityId: string, { tiles }: { tiles: Tiles }) {
        super(entityId)

        this.tiles = tiles
    }
}
