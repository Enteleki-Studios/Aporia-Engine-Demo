import { Quaternion, Vector3 } from 'three'
import { Component, arrayUtils } from 'gengine'
import { POSITION } from './types'

export class PositionComponent extends Component {
    type = POSITION
    position: Vector3
    quaternion: Quaternion
    rotation: Quaternion
    velocity: Vector3
    prevPosition: Vector3
    needsUpdate: boolean

    constructor(entityId: string, position: Vector3) {
        super(entityId)

        this.position = position

        this.quaternion = new Quaternion()
        this.rotation = new Quaternion()
        this.velocity = new Vector3()
        this.prevPosition = new Vector3()
        this.needsUpdate = true
    }

    inspect() {
        return {
            ...super.inspect(),
            position: arrayUtils.trimNumberArrayToString(this.position.toArray()),
            quaternion: arrayUtils.trimNumberArrayToString(this.quaternion.toArray()),
            rotation: arrayUtils.trimNumberArrayToString(this.rotation.toArray()),
            velocity: arrayUtils.trimNumberArrayToString(this.velocity.toArray()),
        }
    }
}
