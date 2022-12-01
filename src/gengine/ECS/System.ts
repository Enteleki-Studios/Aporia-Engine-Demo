import type { World } from '../World'
import type { ECSFilter } from './ECSFilter'
import type { Entity } from './Entity'

export abstract class System {
    abstract filters: ECSFilter[]

    abstract tick(world: World): void

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    receiveEntity(entity: Entity, filter: ECSFilter) {}
}
