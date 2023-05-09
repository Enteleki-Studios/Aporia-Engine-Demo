import type { Array3 } from '../constants'
import { Component } from '../ecs'

type VelocitySettings = {
    velocity?: Array3
}

export class VelocityComponent extends Component {
    velocity: Array3

    constructor({ velocity }: VelocitySettings = {}) {
        super()

        this.velocity = velocity ?? [0, 0, 0]
    }
}
