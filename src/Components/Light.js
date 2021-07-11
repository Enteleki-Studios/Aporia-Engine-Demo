import { LIGHT } from './types'

export default function Light(entity, lightType, { color, intensity } = {}) {
    return {
        type: LIGHT,
        entity,

        lightType,

        color,
        intensity,

        resource: null,
    }
}
