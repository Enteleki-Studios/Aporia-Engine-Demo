import { ECSFilter } from 'ecs'
import {
    ambientLightComponent,
    basicGeometryComponent,
    cameraComponent,
    colliderComponent,
    directionComponent,
    // directionalLightComponent,
    inputComponent,
    modelComponent,
    pointLightComponent,
    positionComponent,
    velocityComponent,
    tags,
} from 'components'

export const ambientLightFilter = new ECSFilter([ambientLightComponent])
export const boxFilter = new ECSFilter([basicGeometryComponent, positionComponent])
export const cameraFilter = new ECSFilter([cameraComponent])
export const cameraTargetFilter = new ECSFilter(
    [positionComponent, directionComponent],
    [tags.cameraTarget],
)
export const collidingFilter = new ECSFilter([colliderComponent, positionComponent])
// export const directionalLightFilter = new ECSFilter([directionalLightComponent])
export const heroFilter = new ECSFilter([], [tags.hero])
export const inputFilter = new ECSFilter([inputComponent])
export const modelFilter = new ECSFilter([modelComponent, positionComponent])
export const movingEntitiesFilter = new ECSFilter([positionComponent, velocityComponent])
export const pointLightFilter = new ECSFilter([positionComponent, pointLightComponent])
export const rotatingEntitiesFilter = new ECSFilter([directionComponent, positionComponent])
