import { MODEL } from './types'

export function Model(entity, { modelId }) {
    return {
        type: MODEL,
        entity,

        modelId,
        resource: null,
        isLoading: false,
    }
}
