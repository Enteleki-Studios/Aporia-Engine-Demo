export default function Light(entity, lightType, { color, intensity } = {}) {
    return {
        type: 'light',
        entity,

        lightType,

        color,
        intensity,
    }
}
