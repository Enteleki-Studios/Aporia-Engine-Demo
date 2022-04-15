import { Component } from '../ECS/Component'

export class HitboxComponent extends Component {
    type = 'hitbox'
    radius

    constructor(entityId: string, radius = 1) {
        super(entityId)

        this.radius = radius
    }
}
