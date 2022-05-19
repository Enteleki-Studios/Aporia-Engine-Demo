import { Component } from '../ECS/Component'

export class HitboxComponent extends Component {
    radius

    constructor(entityId: string, radius = 1) {
        super(entityId)

        this.radius = radius
    }
}
