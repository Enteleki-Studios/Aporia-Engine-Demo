import { ECS } from './ECS'

export abstract class System {
    abstract tick(delta: number): void

    ECS!: ECS
}
