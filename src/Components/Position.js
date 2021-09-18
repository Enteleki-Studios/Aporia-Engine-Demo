import { Quaternion, Vector3 } from 'three'
import { POSITION } from './types'

export default function Position(entity, position) {
    return {
        type: POSITION,
        entity,

        position,
        quaternion: new Quaternion(),
        rotation: new Quaternion(),
        velocity: new Vector3(),

        prevPosition: new Vector3(),

        needsUpdate: true,
    }
}
