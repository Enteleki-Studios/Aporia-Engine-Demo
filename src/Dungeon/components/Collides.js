import { COLLIDES } from './types'

export function Collides(entity) {
    return {
        type: COLLIDES,
        entity,

        collisions: [],
    }
}
