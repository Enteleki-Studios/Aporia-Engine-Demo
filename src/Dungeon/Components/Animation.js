import { ANIMATION } from './types'

export function Animation(entity, state) {
    return {
        type: ANIMATION,
        entity,
        needsUpdate: true,
        loaded: false,
        isLoading: false,
        prevState: null,
        animations: {},

        state,
    }
}
