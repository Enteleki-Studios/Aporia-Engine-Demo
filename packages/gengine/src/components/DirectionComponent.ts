import type { Array3 } from '../constants'
import { Component } from '../ecs'

export class DirectionComponent extends Component {
    direction: Array3

    constructor(direction?: Array3) {
        super()

        this.direction = direction ?? [0, 0, 1]
    }
}
