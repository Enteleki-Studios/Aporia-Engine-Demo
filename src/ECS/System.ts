import { ECS } from './ECS'

export abstract class System {
    ECS!: ECS
    // eslint-disable-next-line
    tick(delta: number) {}
}
