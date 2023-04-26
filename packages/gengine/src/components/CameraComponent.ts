import { Vec3Like } from 'gl-matrix'

import { Component } from '../ecs'

type CameraSettings = {
    position?: Vec3Like
    lookAt?: Vec3Like
}

export class CameraComponent extends Component {
    position: Vec3Like
    lookAt: Vec3Like

    constructor({ position, lookAt }: CameraSettings = {}) {
        super()

        this.position = position ?? [0, 0, 0]
        this.lookAt = lookAt ?? [0, 0, 0]
    }
}
