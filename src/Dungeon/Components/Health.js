import { HEALTH } from './types'

export function Health(entity, { health } = {}) {
    return {
        type: HEALTH,
        entity,

        health,
    }
}
