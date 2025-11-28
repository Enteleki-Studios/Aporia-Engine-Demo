import type { Wedge } from '@core'

export function generateWedgeMeshData({
    halfWidth: hx,
    halfHeight: hy,
    halfDepth: hz,
}: Wedge) {
    // prettier-ignore
    const vertices = new Float32Array([
        0, 0, 0,    // v0 Front-left   bottom
        0, 0, hz,   // v1 Front-right  bottom
        hx, hy, 0,  // v2 Back-left    top
        hx, hy, hz, // v3 Back-right   top
        hx, 0, 0,   // v4 Back-left    bottom
        hx, 0, hz,  // v5 Back-right   bottom
    ]);

    // prettier-ignore
    const indices = new Uint32Array([
        // Top
        0, 3, 2,
        0, 1, 3,

        // Bottom
        0, 5, 1,
        0, 4, 5,

        // Left
        0, 2, 4,

        // Right
        1, 5, 3,

        // Back
        4, 3, 5,
        4, 2, 3,
    ]);

    return { vertices, indices }
}
