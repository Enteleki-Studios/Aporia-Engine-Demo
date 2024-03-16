import { createComponent, Array3, Shape } from '@gengine/core'

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
