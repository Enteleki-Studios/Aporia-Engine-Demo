import { Component } from '../ECS/Component'

export class HealthComponent extends Component {
    health: number

    constructor(health: number) {
        super()
        this.health = health
    }
}
