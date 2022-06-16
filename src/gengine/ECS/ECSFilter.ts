import type { AnyComponentConstructor } from './Component'
import type { Entity } from './Entity'

export class ECSFilter {
    readonly components: AnyComponentConstructor[]
    readonly entities = new Set<Entity>()

    constructor(components: AnyComponentConstructor[]) {
        this.components = components
    }
}
