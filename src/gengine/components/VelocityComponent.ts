import { Vector3 } from 'three'
import { Component } from '../ECS/Component'

interface VelocitySettings {
    velocity?: [number, number, number],
}

export class VelocityComponent extends Component {
    type = 'velocity'
    velocity = new Vector3()

    constructor(entityId: string, { velocity }: VelocitySettings) {
        super(entityId)

        if (velocity) {
            this.velocity.fromArray(velocity)
        }
    }
}
