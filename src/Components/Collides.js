import { COLLIDES } from './types'

export default function Collides(entity) {
    return {
        type: COLLIDES,
        entity,

        collisions: [],
    }
}
