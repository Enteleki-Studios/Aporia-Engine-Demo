import { Mesh, type Object3D } from 'three'

export const isThreeMesh = (obj3D: Object3D): obj3D is Mesh => obj3D instanceof Mesh
