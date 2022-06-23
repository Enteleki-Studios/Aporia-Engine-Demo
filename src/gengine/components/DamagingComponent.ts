import { Component } from '../ECS/Component'

interface DamagingSettings {
    radius: number
    theta: number
    spoolUp: number
    coolDown: number
    damage: number
}

export class DamagingComponent extends Component {
    delta = 0
    stage: 'spooling' | 'cooling' = 'spooling'

    radius
    theta
    damage
    readonly spoolUp
    readonly coolDown

    constructor({ radius, theta, spoolUp, coolDown, damage }: DamagingSettings) {
        super()

        this.radius = radius
        this.theta = theta
        this.damage = damage
        this.spoolUp = spoolUp
        this.coolDown = coolDown
    }
}
