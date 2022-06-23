import type { World } from '../World'
import { ECSFilter } from './ECSFilter'

export abstract class System {
    abstract filters: ECSFilter[]

    abstract tick(world: World): void
}
