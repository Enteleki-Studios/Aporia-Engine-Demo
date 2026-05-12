import { generateWedgeMeshData } from '@core/utils'

import { type ColliderDesc } from '@dimforge/rapier3d'
import { type Shape3D } from '@enteleki-studios/aporia-engine-core'
import { type Rapier } from '@pluginRapier3D'

export const shapeToColliderDesc = (shape: Shape3D, rapier: Rapier): ColliderDesc => {
    switch (shape.type) {
        case 'ball':
            return rapier.ColliderDesc.ball(shape.radius)

        case 'box':
            return rapier.ColliderDesc.cuboid(
                shape.halfWidth,
                shape.halfHeight,
                shape.halfDepth,
            )
        case 'capsule':
            return rapier.ColliderDesc.capsule(shape.halfHeight, shape.radius)

        case 'heightfield':
            return rapier.ColliderDesc.heightfield(
                shape.nrows,
                shape.ncols,
                new Float32Array(shape.heights),
                { x: shape.scale[0], y: shape.scale[1], z: shape.scale[2] },
            )

        case 'wedge': {
            // Use a convexHull instead of a trimesh to support collisions
            // when the rigid body is dynamic
            const { vertices } = generateWedgeMeshData(shape)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Vertices come from a trusted source
            return rapier.ColliderDesc.convexHull(vertices)!
        }
    }
}
