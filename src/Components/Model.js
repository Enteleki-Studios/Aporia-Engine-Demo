export default function Model(entity, { modelId }) {
    return {
        type: 'model',
        entity,

        modelId,
    }
}
