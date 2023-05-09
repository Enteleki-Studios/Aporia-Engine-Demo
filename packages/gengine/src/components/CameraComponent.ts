import type { Array3 } from '../constants'
import { Component } from '../ecs'

type CameraSettings = {
    position?: Array3
    lookAt?: Array3
}

export class CameraComponent extends Component {
    position: Array3
    lookAt: Array3

    constructor({ position, lookAt }: CameraSettings = {}) {
        super()

        this.position = position ?? [0, 0, 0]
        this.lookAt = lookAt ?? [0, 0, 0]
    }
}
