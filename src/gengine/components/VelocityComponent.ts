import { Vector3 } from 'three'
import { Component } from '../ECS/Component'

interface VelocitySettings {
    velocity?: [number, number, number],
}

export class VelocityComponent extends Component {
    velocity = new Vector3()

    constructor({ velocity }: VelocitySettings = {}) {
        super()

        if (velocity) {
            this.velocity.fromArray(velocity)
        }
    }
}
