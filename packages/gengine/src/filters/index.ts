import { ECSFilter } from 'ecs'
import {
    AmbientLightComponent,
    BasicGeometryComponent,
    CameraComponent,
    ColliderComponent,
    DirectionComponent,
    DirectionalLightComponent,
    InputComponent,
    ModelComponent,
    PointLightComponent,
    PositionComponent,
    VelocityComponent,
    CameraTargetComponent,
    tags,
} from 'components'

export const ambientLightFilter = new ECSFilter([AmbientLightComponent])
export const boxFilter = new ECSFilter([BasicGeometryComponent, PositionComponent])
export const cameraFilter = new ECSFilter([CameraComponent])
export const cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent, DirectionComponent])
export const collidingFilter = new ECSFilter([ColliderComponent, PositionComponent])
export const directionalLightFilter = new ECSFilter([DirectionalLightComponent])
export const heroFilter = new ECSFilter([], [tags.hero])
export const inputFilter = new ECSFilter([InputComponent])
export const modelFilter = new ECSFilter([ModelComponent, PositionComponent])
export const movingEntitiesFilter = new ECSFilter([PositionComponent, VelocityComponent])
export const pointLightFilter = new ECSFilter([PositionComponent, PointLightComponent])
export const rotatingEntitiesFilter = new ECSFilter([DirectionComponent, PositionComponent])
