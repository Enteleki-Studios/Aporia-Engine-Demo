import { Quaternion, Vector3 } from 'three'
import { Component } from 'ECS'
import { POSITION } from './types'

export class PositionComponent extends Component {
    position: Vector3
    quaternion: Quaternion
    rotation: Quaternion
    velocity: Vector3
    prevPosition: Vector3
    needsUpdate: boolean

    constructor(entityId: number, position: Vector3) {
        super(POSITION, entityId)

        this.position = position

        this.quaternion = new Quaternion()
        this.rotation = new Quaternion()
        this.velocity = new Vector3()
        this.prevPosition = new Vector3()
        this.needsUpdate = true
    }
}
