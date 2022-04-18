import { Quaternion, Vector3 } from 'three'
import { Component } from '../ECS/Component'

interface PositionSettings {
    position: [number, number, number],
}

export class PositionComponent extends Component {
    type = 'position'
    position: Vector3

    // TODO refactor which props we need
    prevPosition = new Vector3()
    rotation = new Quaternion() // Model rotation
    quaternion: Quaternion = new Quaternion() // "Forwards" direction
    needsUpdate = true

    constructor(entityId: string, { position }: PositionSettings = { position: [0, 0, 0] }) {
        super(entityId)

        this.position = new Vector3().fromArray(position || [0, 0, 0])
    }
}
