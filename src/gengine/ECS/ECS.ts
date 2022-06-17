import { v4 as uuid } from 'uuid'

import type { Component } from './Component'
import { ECSFilter } from './ECSFilter'
import { Entity, EntityId } from './Entity'
import { System } from './System'

export class ECS {
    entitiesById = new Map<EntityId, Entity>()
    filters = new Set<ECSFilter>()

    createEntity() {
        const id = uuid().toUpperCase()
        const entity = new Entity(id)

        this.entitiesById.set(id, entity)

        return id
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
            })
            this.updateFiltersForEntity(entity)
        } else {
            throw new Error(`Entity does not exist ${entityId}`)
        }
    }

    registerFilters(filters: ECSFilter[]) {
        filters.forEach((f) => this.filters.add(f))
    }

    updateFiltersForEntity(entity: Entity) {
        this.filters.forEach((filter) => {
            if (entity.hasAll(filter.filterBy)) {
                filter.entities.add(entity)
            } else {
                filter.entities.delete(entity)
            }
        })
    }

    // removeComponents() {}

    registerSystem(system: System) {
        this.registerFilters(system.filters)
    }

    registerSystems(...systems: System[]) {
        systems.forEach((s) => this.registerSystem(s))
    }

    // disableSystem() {}

    // unregisterSystem() {} // Do we need this?

    // tick() {}
}
