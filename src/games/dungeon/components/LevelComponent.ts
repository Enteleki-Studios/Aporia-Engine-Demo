import { Component } from 'gengine'
import type { Tiles } from 'utils/tilesGenerator'

export class LevelComponent extends Component {
    type = 'level'
    readonly tiles: Tiles

    constructor(entityId: string, { tiles }: { tiles: Tiles }) {
        super(entityId)

        this.tiles = tiles
    }
}
