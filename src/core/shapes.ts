import type { Array3 } from '@core'

export const SHAPE_TYPES = {
    BALL: 'ball',
    BOX: 'box',
    HEIGHTFIELD: 'heightfield',
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
    halfHeight: number
    halfWidth: number
    halfDepth: number
}

export type HeightField = {
    type: typeof SHAPE_TYPES.HEIGHTFIELD
    nrows: number
    ncols: number
    heights: number[]
    scale: Array3
}

export type Shape2D = Ball
export type Shape3D = Ball | Box | HeightField
export type Shape = Shape2D | Shape3D
