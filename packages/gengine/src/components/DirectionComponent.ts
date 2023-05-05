import { Vec3, type Vec3Like } from 'gl-matrix/dist/esm'
import { Component } from '../ecs'

export class DirectionComponent extends Component {
    direction: Vec3

    constructor(direction?: Vec3Like) {
        super()

        this.direction = new Vec3(direction ?? [0, 0, 1])
    }
}
