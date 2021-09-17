import { ATTACK } from './types'

export default function Attack(entity, { damage, range } = {}) {
    return {
        type: ATTACK,
        entity,

        damage,
        range,

        spoolUp: 750,
        coolDown: 750,

        delta: 0,
        hasDealtDamage: false,
    }
}
