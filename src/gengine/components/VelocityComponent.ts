import { Quaternion, Vector3 } from 'three'
import { Component } from '../ECS/Component'

interface VelocitySettings {
    velocity?: [number, number, number],
    quaternion?: [number, number, number, number],
}

export class VelocityComponent extends Component {
    type = 'velocity'
    velocity: Vector3
    quaternion: Quaternion

    constructor(entityId: string, { velocity, quaternion }: VelocitySettings) {
        super(entityId)

        this.velocity = new Vector3().fromArray(velocity || [0, 0, 0])
        this.quaternion = new Quaternion().fromArray(quaternion || [0, 0, 0, 0])
    }
}
