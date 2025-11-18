import type { Array3 } from "@core"

export const SHAPE_TYPES = {
    BALL: 'ball',
    HEIGHTFIELD: 'heightfield',
} as const

export type Ball = {
    type: typeof SHAPE_TYPES.BALL
    radius: number
}

export type HeightField = {
    type: typeof SHAPE_TYPES.HEIGHTFIELD
    nrows: number
    ncols: number
    heights: number[]
    scale: Array3
}

export type Shape2D = Ball
export type Shape3D = Ball | HeightField
export type Shape = Shape2D | Shape3D
