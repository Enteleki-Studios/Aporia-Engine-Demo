import type { AnyComponentConstructor } from './Component'
import type { Entity } from './Entity'

export class ECSFilter {
    private readonly components: AnyComponentConstructor[]
    private readonly tags: string[]

    constructor(components: AnyComponentConstructor[] = [], tags: string[] = []) {
        this.components = [...new Set(components)].sort() // Remove duplicates
        this.tags = [...new Set(tags)].sort()
    }

    static of(components?: AnyComponentConstructor[], tags?: string[]) {
        return new ECSFilter(components, tags)
    }

    match(entity: Entity) {
        return entity.hasAll(this.components) && entity.hasTags(this.tags)
    }

    with(components: AnyComponentConstructor[] = [], tags: string[] = []) {
        return ECSFilter.of([...this.components, ...components], [...this.tags, ...tags])
    }

    and(filter: ECSFilter) {
        return ECSFilter.of([...this.components, ...filter.components], [...this.tags, ...filter.tags])
    }

    toString() {
        return `([${this.components.map((c) => c.name).join(', ')}][${this.tags.join(', ')}])`
    }
}
