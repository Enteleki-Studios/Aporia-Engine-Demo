import { v4 as uuid } from 'uuid'

import type { Component } from './Component'
import { Entity, EntityId } from './Entity'

export class ECS {
    entitiesById: Map<EntityId, Entity>

    constructor() {
        this.entitiesById = new Map()
    }

    createEntity() {
        const id = uuid().toUpperCase()
        const entity = new Entity(id)

        this.entitiesById.set(id, entity)

        return entity
    }

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }

    // removeEntity(entityId: EntityId) {
    //     // TODO queue and remove after tick
    //     // remove from caches
    // }

    addComponents(entityId: EntityId, ...components: Component[]) {
        // const { name } = component.constructor
        const entity = this.entitiesById.get(entityId)

        if (entity) {
            components.forEach((component) => {
                entity.addComponent_Unsafe(component)
                // TODO Add entity to query caches
            })
        } else {
            throw new Error(`Entity does not exist ${entityId}`)
        }
    }

    // removeComponents() {}

    // registerSystem() {}

    // unregisterSystem() {} // Do we need this?

    // tick() {}
}
