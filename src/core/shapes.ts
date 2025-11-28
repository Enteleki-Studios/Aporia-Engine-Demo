import type { Array3 } from '@core'

export const SHAPE_TYPES = {
    BALL: 'ball',
    BOX: 'box',
    CAPSULE: 'capsule',
    HEIGHTFIELD: 'heightfield',
    WEDGE: 'wedge',
} as const

// 2D + 3D
export type Ball = {
    type: typeof SHAPE_TYPES.BALL
    radius: number
}

// 2D
// TODO: Add 2D shapes

// 3D
export type Box = {
    type: typeof SHAPE_TYPES.BOX
    halfWidth: number
    halfHeight: number
    halfDepth: number
}

export type Capsule = {
    type: typeof SHAPE_TYPES.CAPSULE
    radius: number
    halfHeight: number
}

export type HeightField = {
    type: typeof SHAPE_TYPES.HEIGHTFIELD
    ncols: number
    nrows: number
    heights: number[]
    scale: Array3
}

export type Wedge = {
    type: typeof SHAPE_TYPES.WEDGE
    halfWidth: number
    halfHeight: number
    halfDepth: number
}

export type Shape2D = Ball
export type Shape3D = Ball | Box | Capsule | HeightField | Wedge
export type Shape = Shape2D | Shape3D
