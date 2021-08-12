import { LEVEL } from './types'

export default function Level(entity, { seed }) {
    return {
        type: LEVEL,
        entity,

        seed,
        resource: null,
    }
}
