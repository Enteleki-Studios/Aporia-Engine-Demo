import { Vector3 } from 'three'
import { LIGHT } from './types'

export default function Light(entity, lightType, { color, intensity } = {}) {
    return {
        type: LIGHT,
        entity,

        lightType,

        color,
        intensity,

        position: new Vector3(),
        target: new Vector3(),

        needsUpdate: true,

        resource: null,
    }
}
