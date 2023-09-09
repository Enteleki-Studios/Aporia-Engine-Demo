import { ECSFilter } from "ecs"
import {
    AmbientLightComponent,
    BasicGeometryComponent,
    CameraComponent,
    ColliderComponent,
    DirectionComponent,
    DirectionalLightComponent,
    ModelComponent,
    PointLightComponent,
    PositionComponent,
    VelocityComponent,
    CameraTargetComponent,
} from 'components'

export const movingEntitiesFilter = new ECSFilter([PositionComponent, VelocityComponent])
export const modelFilter = new ECSFilter([ModelComponent, PositionComponent])
export const directionalLightFilter = new ECSFilter([DirectionalLightComponent])
export const ambientLightFilter = new ECSFilter([AmbientLightComponent])
export const cameraFilter = new ECSFilter([CameraComponent])
export const pointLightFilter = new ECSFilter([PositionComponent, PointLightComponent])
export const boxFilter = new ECSFilter([BasicGeometryComponent, PositionComponent])
export const rotatingEntitiesFilter = new ECSFilter([DirectionComponent, PositionComponent])
export const collidingFilter = new ECSFilter([ColliderComponent, PositionComponent])
export const cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent, DirectionComponent])
