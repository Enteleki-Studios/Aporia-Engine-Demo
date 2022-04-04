import { Quaternion, Vector3 } from 'three'
import { Component } from '../ECS/Component'
import { trimNumberArrayToString } from '../utils/arrayUtils'

interface PositionSettings {
    position: [number, number, number],
}

export class PositionComponent extends Component {
    type = 'position'
    position: Vector3

    // TODO refactor which props we need
    prevPosition = new Vector3()
    rotation = new Quaternion()
    quaternion: Quaternion = new Quaternion()
    needsUpdate = true
    velocity = new Vector3()

    constructor(entityId: string, { position }: PositionSettings = { position: [0, 0, 0] }) {
        super(entityId)

        this.position = new Vector3().fromArray(position || [0, 0, 0])
    }

    inspect() {
        return {
            ...super.inspect(),
            position: trimNumberArrayToString(this.position.toArray()),
        }
    }
}
