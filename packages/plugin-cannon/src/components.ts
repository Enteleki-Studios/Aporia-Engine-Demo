import { createComponent, Array3 } from '@gengine/core'

export type Shape =
    | {
          type: 'box'
          size: Array3
      }
    | {
          type: 'sphere'
          radius: number
      }
    | {
          type: 'plane'
      }
    | {
          type: 'cylinder'
          radiusTop?: number
          radiusBottom?: number
          height?: number
          numSegments?: number
      }

type PhysicsBodyProps = {
    // Custom
    externalControl?: boolean

    // Native
    shape: Shape
    mass?: number
    fixedRotation?: boolean
    velocity?: Array3
    material?: {
        friction?: number
        restitution?: number
    }
}

export const physicsBody = createComponent('physicsBody', (props: PhysicsBodyProps) => props)
