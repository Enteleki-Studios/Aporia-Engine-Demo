import type { Wedge } from '@enteleki-studios/aporia-engine-core'

export function generateWedgeMeshData({
    halfWidth: hx,
    halfHeight: hy,
    halfDepth: hz,
}: Wedge) {
    const y = hy * 2

    // prettier-ignore
    const vertices = new Float32Array([
        -hx, 0,  hz,  // v0 Front-left   bottom
         hx, 0,  hz,  // v1 Front-right  bottom
        -hx, y, -hz,  // v2 Back-left    top
         hx, y, -hz,  // v3 Back-right   top
        -hx, 0, -hz,  // v4 Back-left    bottom
         hx, 0, -hz,  // v5 Back-right   bottom
    ]);

    // prettier-ignore
    const indices = new Uint32Array([
        0, 3, 2, // Top
        0, 1, 3, // Top

        0, 5, 1, // Bottom
        0, 4, 5, // Bottom

        0, 2, 4, // Left

        1, 5, 3, // Right

        4, 3, 5, // Back
        4, 2, 3, // Back
    ]);

    // prettier-ignore
    const uvs = new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        1, 1,
        0, 1,
        1, 1,
    ])

    return { vertices, indices, uvs }
}
