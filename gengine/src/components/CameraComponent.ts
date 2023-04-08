import { Vector3 } from 'three'
import { Component } from '../ecs'

type CameraSettings = {
    position?: [number, number, number]
    lookAt?: [number, number, number]
}

export class CameraComponent extends Component {
    position: Vector3
    lookAt: Vector3

    constructor({ position, lookAt }: CameraSettings = {}) {
        super()

        this.position = new Vector3().fromArray(position ?? [0, 0, 0])
        this.lookAt = new Vector3().fromArray(lookAt ?? [0, 0, 0])
    }
}
