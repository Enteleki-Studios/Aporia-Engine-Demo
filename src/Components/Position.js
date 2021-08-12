import { Quaternion } from 'three'
import { POSITION } from './types'

export default function Position(entity, position) {
    return {
        type: POSITION,
        entity,

        position,
        quaternion: new Quaternion(),
        rotation: new Quaternion(),

        needsUpdate: true,
    }
}
