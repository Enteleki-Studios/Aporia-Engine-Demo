import { Component } from '../ecs'

export class HitboxComponent extends Component {
    radius

    constructor(radius = 1) {
        super()

        this.radius = radius
    }
}
