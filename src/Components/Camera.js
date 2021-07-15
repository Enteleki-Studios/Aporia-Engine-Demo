import { Vector3 } from 'three'
import { CAMERA } from './types'

export default function Camera(entity) {
    return {
        type: CAMERA,
        entity,

        position: new Vector3(),
        lookAt: new Vector3(),
        needsUpdate: true,
    }
}
