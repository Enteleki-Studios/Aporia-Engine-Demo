import type { AnyComponentConstructor } from './Component'
import type { Entity } from './Entity'

export class ECSFilter {
    private readonly components: AnyComponentConstructor[]

    constructor(components: AnyComponentConstructor[]) {
        this.components = [...new Set(components)].sort() // Remove duplicates
    }

    static of(components: AnyComponentConstructor[]) {
        return new ECSFilter(components)
    }

    match(entity: Entity) {
        return entity.hasAll(this.components)
    }

    with(components: AnyComponentConstructor[]) {
        return ECSFilter.of([...this.components, ...components])
    }

    and(filter: ECSFilter) {
        return ECSFilter.of([...this.components, ...filter.components])
    }

    toString() {
        return `[${this.components.map((c) => c.name).join(', ')}]`
    }
}
