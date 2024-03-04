import { v4 as uuid } from 'uuid'

import type { Component, AnyComponentCreator } from 'core'

export type EntityId = string

type EntityOptions = {
    id?: EntityId
    name?: string
}

export class Entity {
    readonly id: EntityId
    readonly name?: string

    private onAddComponents: ((components: Component[]) => void) | undefined
    private components = new Map<string, Component>()
    private tags = new Set<string>()

    constructor(options?: EntityOptions) {
        this.id = options?.id ?? uuid()
        this.name = options?.name
    }

    addComponents(...components: Component[]) {
        components.forEach((component) => {
            this.components.set(component.type, component)
        })
        this.onAddComponents?.(components)

        return this
    }

    getComponents() {
        return Array.from(this.components.values())
    }

    /** @internal */
    removeComponent_Unsafe(componentCreator: AnyComponentCreator) {
        this.components.delete(componentCreator.type)
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

    registerAddComponentCallback(cb: (components: Component[]) => void) {
        this.onAddComponents = cb
    }
}
