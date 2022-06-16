import { ECSFilter } from './ECSFilter'

export abstract class System {
    abstract filters: ECSFilter[]

    abstract tick(): void
}
