import type { Octree } from 'three/examples/jsm/math/Octree'
import type { Capsule } from 'three/examples/jsm/math/Capsule'

declare module 'three/examples/jsm/math/Octree' {
    export interface Octree {
        capsuleIntersect(capsule: Capsule):
            | false
            | {
                  normal: number[]
                  depth: number
              }
    }
}
