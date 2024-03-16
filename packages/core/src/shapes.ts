import { Array2, Array3 } from 'definitions'

// 2D
type Circle = {
    type: 'circle'
    radius: number
}

type Rectangle = {
    type: 'square'
    size: Array2
}

// 3D
type Box = {
    type: 'box'
    size: Array3
}

type Capsule = {
    type: 'capsule'
    radius: number
    height: number
}

type Cone = {
    type: 'cone'
    radius: number
    height: number
}

type Cylinder = {
    type: 'cylinder'
    radius: number
    height: number
}

type Plane = {
    type: 'plane'
}

type Sphere = {
    type: 'sphere'
    radius: number
}

export type Shape2D = Circle | Rectangle
export type Shape3D = Plane | Sphere | Box | Capsule | Cylinder | Cone
export type Shape = Shape2D | Shape3D
