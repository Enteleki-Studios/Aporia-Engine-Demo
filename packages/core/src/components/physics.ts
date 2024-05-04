import { createComponent } from 'core'
import { Array3 } from 'definitions'
import { Shape3D } from 'shapes'

type RigidBody3DProps = {
    mass?: number
    velocity?: Array3
    fixedRotation?: boolean
}

export const rigidBody3D = createComponent('rigidBody3D', (props: RigidBody3DProps) => ({
    mass: props.mass ?? 0,
    velocity: props.velocity ?? ([0, 0, 0] as Array3),
    fixedRotation: props.fixedRotation ?? false,
}))

export const characterController = createComponent('characterController', () => ({}))

type Collider3DProps = {
    shape: Shape3D
    isSensor?: boolean
    friction?: number
    restitution?: number
}

export const collider3D = createComponent('collider3D', (props: Collider3DProps) => ({
    shape: props.shape,
    isSensor: props.isSensor ?? false,
    friction: props.friction ?? null,
    restitution: props.restitution ?? null,
}))
