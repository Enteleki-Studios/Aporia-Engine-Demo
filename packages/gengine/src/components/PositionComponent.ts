import type { Array3 } from '../constants'
import { Component } from '../ecs'

type PositionSettings = {
    position?: Array3
}

export class PositionComponent extends Component {
    position: Array3

    constructor({ position }: PositionSettings = {}) {
        super()

        this.position = position ?? [0, 0, 0]
    }
}
