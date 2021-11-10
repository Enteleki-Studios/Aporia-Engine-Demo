import { LEVEL } from './types'

export function Level(entity, { seed }) {
    return {
        type: LEVEL,
        entity,

        seed,
        resource: null,
    }
}
