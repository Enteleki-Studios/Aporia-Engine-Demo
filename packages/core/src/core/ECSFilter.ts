import type { Entity, AnyComponentCreator } from 'core'

export class ECSFilter {
    private readonly components: AnyComponentCreator[]
    private readonly tags: string[]

    constructor(components: AnyComponentCreator[] = [], tags: string[] = []) {
        this.components = [...new Set(components)].sort() // Remove duplicates
        this.tags = [...new Set(tags)].sort()
    }

    static of(components?: AnyComponentCreator[], tags?: string[]) {
        return new ECSFilter(components, tags)
    }

    match(entity: Entity) {
        return entity.hasAll(this.components) && entity.hasTags(this.tags)
    }

    with(components: AnyComponentCreator[] = [], tags: string[] = []) {
        return ECSFilter.of([...this.components, ...components], [...this.tags, ...tags])
    }

    and(filter: ECSFilter) {
        return ECSFilter.of([...this.components, ...filter.components], [...this.tags, ...filter.tags])
    }

    toString() {
        return `([${this.components.map((c) => c.type).join(', ')}][${this.tags.join(', ')}])`
    }
}
