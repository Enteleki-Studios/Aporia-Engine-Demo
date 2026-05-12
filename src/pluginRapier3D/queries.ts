import { Transform3DComponent } from '@enteleki-studios/aporia-engine-core/components'
import { createQuery } from '@pluginEntities'

import {
    ColliderComponent,
    RigidBodyDynamic,
    RigidBodyFixed,
    RigidBodyKinematic,
} from './components'

export const dynamicBodiesQuery = createQuery([
    ColliderComponent,
    Transform3DComponent,
    RigidBodyDynamic,
])

export const fixedBodiesQuery = createQuery([
    ColliderComponent,
    Transform3DComponent,
    RigidBodyFixed,
])

export const kinematicBodiesQuery = createQuery([
    ColliderComponent,
    Transform3DComponent,
    RigidBodyKinematic,
])
