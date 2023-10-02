import { v4 as uuid } from 'uuid'

import type { Component, ComponentCreator } from 'ecs'

export type EntityId = string

export class Entity {
    id: EntityId
    onAddComponents: ((components: Component[]) => void) | undefined
    private components = new Map<string, Component>()
    private tags = new Set<string>()

    constructor(id?: EntityId) {
        this.id = id ?? uuid()
    }

    /**
     * This passes the components along to the ECS
     * which does the actual component processing
     */
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
    removeComponent_Unsafe(componentCreator: ComponentCreator) {
        this.components.delete(componentCreator.type)
    }

    get<T, I, P>(componentCreator: ComponentCreator<T, I, P>) {
        return this.components.get(componentCreator.type) as Component<T, P>
    }

    has(componentCreator: ComponentCreator) {
        return this.components.has(componentCreator.type)
    }

    hasAll(componentCreators: ComponentCreator[]) {
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
}
