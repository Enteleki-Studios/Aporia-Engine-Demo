import { Component } from '../ECS/Component'

export class HitboxComponent extends Component {
    type = 'hitbox'
    radius: number

    constructor(entityId: string, radius: number) {
        super(entityId)

        this.radius = radius
    }
}
