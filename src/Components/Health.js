import { HEALTH } from './types'

export default function Health(entity, { health } = {}) {
    return {
        type: HEALTH,
        entity,

        health,
    }
}
