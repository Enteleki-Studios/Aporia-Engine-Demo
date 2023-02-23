import type { AnyComponentConstructor } from './Component'
import type { Entity } from './Entity'

export class ECSFilter {
    readonly filterBy: AnyComponentConstructor[]
    readonly entities = new Set<Entity>()

    constructor(components: AnyComponentConstructor[]) {
        this.filterBy = components
    }

    match(entity: Entity) {
        return entity.hasAll(this.filterBy)
    }
}
