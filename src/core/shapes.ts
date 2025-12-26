import type { Array3 } from '@core'

// 2D + 3D
export type Ball = {
    type: 'ball'
    radius: number
}

// 2D
// TODO: Add 2D shapes

// 3D
export type Box = {
    type: 'box'
    halfWidth: number
    halfHeight: number
    halfDepth: number
}

export type Capsule = {
    type: 'capsule'
    radius: number
    halfHeight: number
}

export type HeightField = {
    type: 'heightfield'
    ncols: number
    nrows: number
    heights: number[]
    scale: Array3
}

export type Wedge = {
    type: 'wedge'
    halfWidth: number
    halfHeight: number
    halfDepth: number
}

export type Shape2D = Ball
export type Shape3D = Ball | Box | Capsule | HeightField | Wedge
