import { type Shape3DComponent } from '@core/components'

import { createComponent } from '@enteleki-studios/aporia-engine-core'

export const RigidBodyDynamic = createComponent('RigidBodyDynamic')
export const RigidBodyFixed = createComponent('RigidBodyFixed')
export const RigidBodyKinematic = createComponent('RigidBodyKinematic')

type ColliderDescription = {
    shape: Shape3DComponent
    density?: number
    friction?: number
    isSensor?: boolean
}

export const ColliderComponent = createComponent(
    'Collider',
    (
        shape: Shape3DComponent,
        config: Omit<ColliderDescription, 'shape'> = {},
    ): ColliderDescription => ({
        shape,
        ...config,
    }),
)

export const ColliderGroup = createComponent(
    'ColliderGroup',
    (components: ColliderComponent[]) => ({
        components,
    }),
)

export type ColliderComponent = ReturnType<typeof ColliderComponent>
