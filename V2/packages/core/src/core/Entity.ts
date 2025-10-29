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

    private components = new Map<string, Component>()
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
        this.components.set(component.type, component)

        return this
    }

    addComponents(...components: Component[]) {
        components.forEach((component) => {
            this.addComponent(component)
        })

        return this
    }

    removeComponent(componentCreator: AnyComponentCreator) {
        return this.components.delete(componentCreator.type)
    }

    removeComponents(...componentCreators: AnyComponentCreator[]) {
        componentCreators.forEach((componentCreator) => {
            this.removeComponent(componentCreator)
        })
        return this
    }

    get<T extends AnyComponentCreator, N extends T['type']>(
        componentCreator: T,
    ): N extends K ? ReturnType<T> : ReturnType<T> | undefined {
        // @ts-expect-error will need to fix this error later
        return this.components.get(componentCreator.type)
    }

    has(componentCreator: AnyComponentCreator) {
        return this.components.has(componentCreator.type)
    }

    hasAll(componentCreators: AnyComponentCreator[]) {
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
