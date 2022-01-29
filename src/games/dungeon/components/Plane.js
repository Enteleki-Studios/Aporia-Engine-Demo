import { PLANE } from './types'

export function Plane(
    entity,
    {
        width,
        height,
        color,
        position,
    },
) {
    return {
        type: PLANE,
        entity,

        width,
        height,
        color,
        position,

        resource: null,
    }
}
