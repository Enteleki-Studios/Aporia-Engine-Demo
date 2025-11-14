import { createComponent } from '~/core'

type CylinderCollider = {
    type: 'cylinder'
    radius: number
    height: number
    resolution: number
}

type BoxCollider = {
    type: 'box'
    width: number
    height: number
    depth: number
}

export type Collider = BoxCollider | CylinderCollider

export const colliderComponent = createComponent(
    'colliderComponent',
    ({ collider }: { collider: Collider }) => ({
        collider,
    }),
)
