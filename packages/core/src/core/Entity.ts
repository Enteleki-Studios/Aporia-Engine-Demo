import { v4 as uuid } from 'uuid'

import { type AnyComponentCreator, type Component } from '~/core'

export type EntityId = string

type EntityOptions = {
    id?: EntityId
    name?: string
}

export class Entity {
    readonly id: EntityId
    readonly name: string | undefined

    private components = new Map<string, Component>()
    private tags = new Set<string>()

    static of(componentOrOptions?: EntityOptions | Component, ...components: Component[]): Entity {
        const options = componentOrOptions && 'type' in componentOrOptions ? undefined : componentOrOptions
        const entity = new Entity(options)

        if (componentOrOptions && 'type' in componentOrOptions) {
            entity.addComponent(componentOrOptions)
        }

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

    get<T extends AnyComponentCreator>(componentCreator: T) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.components.get(componentCreator.type) as ReturnType<T>
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
