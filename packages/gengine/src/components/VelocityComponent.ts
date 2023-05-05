import { Vec3, type Vec3Like } from 'gl-matrix/dist/esm'
import { Component } from '../ecs'

type VelocitySettings = {
    velocity?: Vec3Like
}

export class VelocityComponent extends Component {
    velocity: Vec3

    constructor({ velocity }: VelocitySettings = {}) {
        super()

        this.velocity = new Vec3(velocity ?? [0, 0, 0])
    }
}
