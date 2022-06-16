import { Quaternion, Vector3 } from 'three'
import { Component } from '../ECS/Component'

interface PositionSettings {
    position: [number, number, number],
}

export class PositionComponent extends Component {
    position: Vector3
    rotation = new Quaternion() // Model rotation

    constructor({ position }: PositionSettings = { position: [0, 0, 0] }) {
        super()

        this.position = new Vector3().fromArray(position || [0, 0, 0])
    }
}
