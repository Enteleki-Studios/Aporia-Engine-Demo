import type { World } from '../World'
import type { ECSFilter } from './ECSFilter'
import type { Entity } from './Entity'

export type System = {
    filters: ECSFilter[]

    tick(world: World): void

    receiveEntity?: (entity: Entity, filter: ECSFilter) => void
}
