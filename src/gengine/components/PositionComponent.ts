import { Vector3 } from 'three'
import { Component } from '../ECS/Component'
import { trimNumberArrayToString } from '../utils/arrayUtils'
import { POSITION } from './componentTypes'

interface PositionSettings {
    position?: [number, number, number],
}

export class PositionComponent extends Component {
    type = POSITION
    position: Vector3

    constructor(entityId: string, { position }: PositionSettings) {
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
