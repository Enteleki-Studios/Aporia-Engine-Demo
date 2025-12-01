import { type mat3, quat, vec3 } from 'gl-matrix'

const Y_AXIS = [0, 1, 0]

// Vector pool
const x: vec3 = [0, 0, 0]
const y: vec3 = [0, 0, 0]
const z: vec3 = [0, 0, 0]

// TODO: May fail if dir is parallel to UP

export const quatLookAt = (out: quat, dir: vec3, up: vec3 = Y_AXIS): quat => {
    vec3.normalize(z, dir)

    // Flip the vector because "forward" is -Z
    vec3.negate(z, z)

    if (vec3.length(z) < 1e-6) {
        return quat.identity(out)
    }

    vec3.cross(x, up, z)
    vec3.normalize(x, x)
    vec3.cross(y, z, x)

    // Build rotation matrix
    const m: mat3 = [x[0], x[1], x[2], y[0], y[1], y[2], z[0], z[1], z[2]]

    quat.fromMat3(out, m)

    return quat.normalize(out, out)
}
