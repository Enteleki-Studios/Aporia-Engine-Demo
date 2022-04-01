import { Vector3 } from 'three'
import { Component } from 'gengine'
import { CAMERA } from './types'

export class CameraComponent extends Component {
    type = CAMERA
    position: Vector3
    lookAt: Vector3

    constructor(entityId: string) {
        super(entityId)

        this.position = new Vector3()
        this.lookAt = new Vector3()
    }
}
