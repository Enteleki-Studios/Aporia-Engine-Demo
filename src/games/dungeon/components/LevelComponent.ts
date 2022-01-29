import { Component } from 'gengine'
import type { Tiles } from 'utils/tilesGenerator'
import { LEVEL } from './types'

export class LevelComponent extends Component {
    type = LEVEL
    readonly tiles: Tiles

    constructor(entityId: string, { tiles }: { tiles: Tiles }) {
        super(entityId)

        this.tiles = tiles
    }
}
