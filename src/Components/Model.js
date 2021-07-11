import { MODEL } from './types'

export default function Model(entity, { modelId }) {
    return {
        type: MODEL,
        entity,

        modelId,
        resource: null,
        isLoading: false,
    }
}
