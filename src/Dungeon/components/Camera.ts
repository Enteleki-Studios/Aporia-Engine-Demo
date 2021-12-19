import { Vector3 } from 'three'
import { Component } from 'ECS'
import { CAMERA } from './types'

export class Camera extends Component {
    position: Vector3
    lookAt: Vector3
    needsUpdate: boolean

    constructor(entityId: number) {
        super(CAMERA, entityId)

        this.position = new Vector3()
        this.lookAt = new Vector3()
        this.needsUpdate = true
    }
}
