import { Vec3, type Vec3Like } from 'gl-matrix/dist/esm'

import { Component } from '../ecs'

type CameraSettings = {
    position?: Vec3Like
    lookAt?: Vec3Like
}

export class CameraComponent extends Component {
    position: Vec3
    lookAt: Vec3

    constructor({ position, lookAt }: CameraSettings = {}) {
        super()

        this.position = new Vec3(position ?? [0, 0, 0])
        this.lookAt = new Vec3(lookAt ?? [0, 0, 0])
    }
}
