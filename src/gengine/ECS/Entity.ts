import { Component, ComponentConstructor, AnyComponentConstructor } from './Component'
import type { ECS } from './ECS'

export type EntityId = string

export class Entity {
    id: EntityId
    private ecs: ECS
    private components = new Map<AnyComponentConstructor, Component>()

    constructor(id: EntityId, ecs: ECS) {
        this.id = id
        this.ecs = ecs
    }

    addComponents(...components: Component[]) {
        this.ecs.addComponents(this.id, ...components)
    }

    addComponent_Unsafe(component: Component) {
        this.components.set(component.constructor, component)
    }

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
}
