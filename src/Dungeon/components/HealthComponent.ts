import { Component } from 'ECS'
import { HEALTH } from './types'

export class HealthComponent extends Component {
    type = HEALTH
    health: number

    constructor(entityId: string, { health }: { health: number }) {
        super(entityId)
        this.health = health
    }
}
