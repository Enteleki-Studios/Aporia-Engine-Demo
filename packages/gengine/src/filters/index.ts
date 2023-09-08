import { ECSFilter } from "ecs"
import { PositionComponent, VelocityComponent } from 'components'

export const movingEntities = new ECSFilter([PositionComponent, VelocityComponent])
