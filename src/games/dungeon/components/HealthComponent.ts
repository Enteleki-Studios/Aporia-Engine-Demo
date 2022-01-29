import { Component } from 'gengine'
import { HEALTH } from './types'

export class HealthComponent extends Component {
    type = HEALTH
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
