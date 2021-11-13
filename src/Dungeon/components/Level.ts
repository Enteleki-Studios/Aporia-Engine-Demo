import { Component } from 'ECS'
import type { Tiles } from 'utils/tilesGenerator'
import { LEVEL } from './types'

export class Level extends Component {
    readonly tiles: Tiles

    constructor(entityId: number, { tiles }: { tiles: Tiles }) {
        super(LEVEL, entityId)

        this.tiles = tiles
    }
}
