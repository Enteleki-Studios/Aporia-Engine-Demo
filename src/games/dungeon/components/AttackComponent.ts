import { Component } from 'gengine'

export class AttackComponent extends Component {
    type = 'attack'
    damage: number
    range: number
    spoolUp: number
    coolDown: number
    delta: number
    hasDealtDamage: boolean

    constructor(entityId: string, { damage, range }: { damage: number, range: number }) {
        super(entityId)

        this.damage = damage
        this.range = range

        this.spoolUp = 500
        this.coolDown = 500

        this.delta = 0
        this.hasDealtDamage = false
    }
}
