import { Vec3, type Vec3Like } from 'gl-matrix/dist/esm'
import { Component } from '../ecs'

type PositionSettings = {
    position?: Vec3Like
}

export class PositionComponent extends Component {
    position: Vec3

    constructor({ position }: PositionSettings = {}) {
        super()

        this.position = new Vec3(position ?? [0, 0, 0])
    }
}
