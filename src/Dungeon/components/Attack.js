import { ATTACK } from './types'

export function Attack(entity, { damage, range } = {}) {
    return {
        type: ATTACK,
        entity,

        damage,
        range,

        spoolUp: 500,
        coolDown: 500,

        delta: 0,
        hasDealtDamage: false,
    }
}
