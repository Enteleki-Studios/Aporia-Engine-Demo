import { Component } from '../ECS/Component'

export class HealthComponent extends Component {
    type = 'health'
    health: number

    constructor(entityId: string, { health }: { health: number }) {
        super(entityId)
        this.health = health
    }

    inspect() {
        return {
            ...super.inspect(),
            health: this.health,
        }
    }
}
