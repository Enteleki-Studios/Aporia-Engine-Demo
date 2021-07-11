import { POSITION } from './types'

export default function Position(entity, position, quaternion) {
    return {
        type: POSITION,
        entity,

        position,
        quaternion,

        needsUpdate: true,
    }
}
