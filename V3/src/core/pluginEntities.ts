import { v4 as uuid } from 'uuid'

import { type AnyComponent, type ComponentKey } from './createComponent'

type EntityId = string

type ComponentMap = Map<ComponentKey, AnyComponent>
type EntityMap = Map<EntityId, ComponentMap>

class Entities {
    private entities: EntityMap = new Map()

    get(entityId: EntityId) {
        return this.entities.get(entityId)
    }

    createEntity() {
        const id = uuid()

        this.entities.set(id, new Map())

        return id
    }

    addComponents(entity: EntityId, ...components: AnyComponent[]) {
        const componentMap = this.entities.get(entity)
        if (componentMap) {
            components.forEach((c) => {
                componentMap.set(c.__key__, c)
            })
        }
    }

    filter(predicate: (cm: ComponentMap, e: EntityId) => boolean) {
        return this.entities
            .entries()
            .filter(([entity, components]) => predicate(components, entity))
    }
}

export const pluginEntities = () => ({
    setup: () => ({
        entities: new Entities(),
    }),
})
