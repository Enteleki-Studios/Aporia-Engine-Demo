import { v4 as uuid } from 'uuid'

import { type AnyComponentCreator, type Component } from '~/core'

export type EntityId = string

type EntityOptions = {
    id?: EntityId
    name?: string
}

export class Entity<K extends string = string> {
    readonly id: EntityId
    readonly name: string | undefined

    private components = new Map<K, Component>()
    private tags = new Set<string>()

    static of<T extends Component[]>(...components: T): Entity<T[number]['type']> {
        const entity = new Entity()

        return entity.addComponents(...components)
    }

    constructor(options?: EntityOptions) {
        this.id = options?.id ?? uuid()
        this.name = options?.name
    }

    addComponent(component: Component) {
        this.components.set(component.type as K, component)

        return this
    }

    addComponents(...components: Component[]) {
        components.forEach((component) => {
            this.addComponent(component)
        })

        return this
    }

    removeComponent(componentCreator: AnyComponentCreator) {
        return this.components.delete(componentCreator.type as K)
    }

    removeComponents(...componentCreators: AnyComponentCreator[]) {
        componentCreators.forEach((componentCreator) => {
            this.removeComponent(componentCreator)
        })
        return this
    }

    get<T extends AnyComponentCreator, N extends T['type']>(componentCreator: T): N extends K ? ReturnType<T> : ReturnType<T> | undefined {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.components.get(componentCreator.type as K)
    }

    has<T extends AnyComponentCreator, N extends T['type']>(componentCreator: T): this is Entity<N | K> {
        return this.components.has(componentCreator.type as K)
    }

    hasAll<T extends AnyComponentCreator[]>(componentCreators: T): this is Entity<T[number]['type']> {
        return componentCreators.every((c) => this.has(c))
    }

    hasSome(componentCreators: AnyComponentCreator[]) {
        return componentCreators.some((c) => this.has(c))
    }

    size() {
        return this.components.size
    }

    tag(...tags: string[]) {
        tags.forEach((t) => this.tags.add(t))

        return this
    }

    hasTag(tag: string) {
        return this.tags.has(tag)
    }

    hasTags(tags: string[]) {
        return tags.every((t) => this.hasTag(t))
    }

    clear() {
        this.components.clear()
        this.tags.clear()
    }
}
