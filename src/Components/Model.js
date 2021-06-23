export default function Model(
    entity,
    {
        resourcePath,
        modelPath,
        texturePath,
        scale,
        initialPosition,
    },
) {
    return {
        type: 'model',
        entity,

        resourcePath,
        modelPath,
        texturePath,
        scale,
        initialPosition,
    }
}
