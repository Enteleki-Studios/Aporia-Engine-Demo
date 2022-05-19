import { Component } from '../ECS/Component'

export class HealthComponent extends Component {
    health: number

    constructor(entityId: string, { health }: { health: number }) {
        super(entityId)
        this.health = health
    }
}
