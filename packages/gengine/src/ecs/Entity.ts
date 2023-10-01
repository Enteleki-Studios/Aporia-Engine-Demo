import { v4 as uuid } from 'uuid'

import { Component, ComponentConstructor, AnyComponentConstructor } from 'ecs/Component'

export type EntityId = string

export class Entity {
    id: EntityId
    onAddComponents: ((components: Component[]) => void) | undefined
    private components = new Map<AnyComponentConstructor, Component>()
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
            this.components.set(component.constructor, component)
        })
        this.onAddComponents?.(components)

        return this
    }

    getComponents() {
        return Array.from(this.components.values())
    }

    /** @internal */
    removeComponent_Unsafe(compClass: AnyComponentConstructor) {
        this.components.delete(compClass)
    }

    get<T extends Component>(compClass: ComponentConstructor<T>) {
        return this.components.get(compClass) as T
    }

    has(compClass: AnyComponentConstructor) {
        return this.components.has(compClass)
    }

    hasAll(compClasses: AnyComponentConstructor[]) {
        return compClasses.every((c) => this.has(c))
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
