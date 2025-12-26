/* eslint-disable @typescript-eslint/consistent-type-assertions -- library code */
import { type AnyComponent, type AnyComponentCreator, type ComponentKey } from '@core'

import { newUUID } from '@core/utils'

export type EntityId = string

export class Entity {
    id: EntityId

    private components = new Map<ComponentKey, AnyComponent>()

    constructor(id?: EntityId) {
        this.id = id ?? newUUID()
    }

    add(component: AnyComponent) {
        this.components.set(component.__key__, component)
    }

    has(componentCreator: AnyComponentCreator) {
        return this.components.has(componentCreator.__key__)
    }

    hasEvery(componentCreators: readonly AnyComponentCreator[]) {
        return componentCreators.every((cc) => this.components.has(cc.__key__))
    }

    hasSome(componentCreators: AnyComponentCreator[]) {
        return componentCreators.some((cc) => this.components.has(cc.__key__))
    }

    delete(componentCreator: AnyComponentCreator) {
        this.components.delete(componentCreator.__key__)
    }

    get<C extends AnyComponentCreator>(component: C) {
        return this.components.get(component.__key__) as ReturnType<C> | undefined
    }

    get size() {
        return this.components.size
    }
}

/* eslint-enable @typescript-eslint/consistent-type-assertions -- library code */
