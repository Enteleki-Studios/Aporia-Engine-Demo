import type { Entity } from './Entity'

export class EntityWrapper {
    readonly entity: Entity

    constructor(entity: Entity) {
        this.entity = entity
    }
}
