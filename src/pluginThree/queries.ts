import { Geometry3DComponent, Transform3DComponent } from '@core/components'

import { createQuery } from '@pluginEntities'

import {
    Animation,
    GltfComponent,
    PerspectiveCamera,
    RenderableDynamic,
} from './components'

export const dynamicRenderables = createQuery([Transform3DComponent, RenderableDynamic])

export const animationQuery = createQuery([Animation])

// TODO: Add renderable component checks to these queries
export const geometryQuery = createQuery([Geometry3DComponent, Transform3DComponent])
export const gltfQuery = createQuery([GltfComponent, Transform3DComponent])
export const perspectiveCameraQuery = createQuery([
    PerspectiveCamera,
    Transform3DComponent,
])
