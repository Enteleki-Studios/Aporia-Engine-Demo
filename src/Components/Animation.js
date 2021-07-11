import { ANIMATION } from './types'

export default function Animation(entity, state) {
    return {
        type: ANIMATION,
        entity,
        needsUpdate: true,
        prevState: null,

        state,
    }
}
