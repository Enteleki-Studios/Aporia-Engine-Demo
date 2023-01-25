import { Vector3 } from 'three'
import { Component } from '../ecs'

export class DirectionComponent extends Component {
    direction: Vector3

    constructor(direction?: [number, number, number]) {
        super()

        this.direction = new Vector3().fromArray(direction || [0, 0, 1])
    }
}
