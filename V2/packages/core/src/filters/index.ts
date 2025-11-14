import {
    ambientLightComponent,
    basicGeometryComponent,
    cameraComponent,
    colliderComponent,
    directionComponent,
    directionalLightComponent,
    inputComponent,
    mesh2D,
    modelComponent,
    pointLightComponent,
    tags,
    transform3D,
    velocityComponent,
} from '~/components'
import { ECSFilter } from '~/core'

export const ambientLightFilter = new ECSFilter([ambientLightComponent])
export const boxFilter = new ECSFilter([basicGeometryComponent, transform3D])
export const cameraFilter = new ECSFilter([cameraComponent])
export const cameraTargetFilter = new ECSFilter(
    [transform3D, directionComponent],
    [tags.cameraTarget],
)
export const collidingFilter = new ECSFilter([colliderComponent, transform3D])
export const directionalLightFilter = new ECSFilter([directionalLightComponent])
export const heroFilter = new ECSFilter([], [tags.hero])
export const inputFilter = new ECSFilter([inputComponent])
export const modelFilter = new ECSFilter([modelComponent, transform3D])
export const movingEntitiesFilter = new ECSFilter([transform3D, velocityComponent])
export const pointLightFilter = new ECSFilter([transform3D, pointLightComponent])
export const rotatingEntitiesFilter = new ECSFilter([directionComponent, transform3D])

export const mesh2DFilter = ECSFilter.of([mesh2D, transform3D])

export const positionedEntitiesFilter = ECSFilter.of([transform3D])
