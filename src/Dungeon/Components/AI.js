import { AI as AIType } from './types'

export function AI(entity) {
    return {
        type: AIType,
        entity,
    }
}
