import { type Shape3D } from '@core'

import { generateWedgeMeshData } from '@core/utils'

import { type ColliderDesc } from '@dimforge/rapier3d'
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
            const { vertices, indices } = generateWedgeMeshData(shape)
            return rapier.ColliderDesc.trimesh(vertices, indices)
        }
    }
}
