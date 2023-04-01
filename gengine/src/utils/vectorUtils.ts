import { Vector3 } from 'three'

export function roundToZero(vector: Vector3, limit = 0.0001) {
    if (Math.abs(vector.x) <= limit) {
        vector.setX(0)
    }
    if (Math.abs(vector.y) <= limit) {
        vector.setY(0)
    }
    if (Math.abs(vector.z) <= limit) {
        vector.setZ(0)
    }
}
