import { AI as AIType } from './types'

export default function AI(entity) {
    return {
        type: AIType,
        entity,
    }
}
