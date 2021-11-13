import { Component } from 'ECS'
import { LEVEL } from './types'

interface Settings {
    seed: number,
}

export class Level extends Component {
    seed: number
    resource: (object | null) = null

    constructor(entity: number, { seed }: Settings) {
        super(LEVEL, entity)

        this.seed = seed
    }
}
