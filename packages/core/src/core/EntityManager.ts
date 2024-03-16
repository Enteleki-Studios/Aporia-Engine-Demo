import { Component, Entity, EntityId } from 'core'
import { Query } from 'definitions'

type FilterListenerCallback = (entity: Entity, filter: Query) => void

export type ECSStatsType = {
    /** Number of entities */
    entities: number
    /** Number of components */
    components: number
    /** Number of registered filters */
    filters: number
}

export class EntityManager {
    private entitiesById = new Map<EntityId, Entity>()
    private entitiesByFilter = new Map<Query, Set<Entity>>()
    private listenersByFilter = new Map<Query, Set<FilterListenerCallback>>()

    stats: ECSStatsType = {
        entities: 0,
        components: 0,
        filters: 0,
    }

    private updateFiltersForEntity(entity: Entity) {
        this.entitiesByFilter.forEach((entities, filter) => {
            if (filter.match(entity)) {
                if (!entities.has(entity)) {
                    entities.add(entity)

                    this.listenersByFilter.get(filter)?.forEach((cb) => cb(entity, filter))
                }
            } else {
                // TODO tell systems that entity was removed
                entities.delete(entity)
            }
        })
    }

    private trackNewComponents(entityId: EntityId, components: Component[]) {
        const entity = this.entitiesById.get(entityId)

        if (entity) {
            this.updateFiltersForEntity(entity)
            this.stats.components += components.length
        }
    }

    filterBy(filter: Query): Set<Entity> {
        const entities = this.entitiesByFilter.get(filter)
        if (entities) {
            return entities
        } else {
            return this.registerFilter(filter)
        }
    }

    addFilterListener(filter: Query, cb: FilterListenerCallback) {
        if (!this.listenersByFilter.has(filter)) {
            this.listenersByFilter.set(filter, new Set())
        }
        this.listenersByFilter.get(filter)?.add(cb)

        const existingEntities = this.entitiesByFilter.get(filter)
        if (existingEntities) {
            // Trigger the callback for all existing entities
            existingEntities.forEach((entity) => {
                cb(entity, filter)
            })
        } else {
            // Otherwise, register the filter to pick up on future entities
            this.registerFilter(filter)
        }
    }

    removeFilterListener(filter: Query, cb: FilterListenerCallback) {
        this.listenersByFilter.get(filter)?.delete(cb)
    }

    // removeEntity(entityId: EntityId) {
    //     // TODO queue and remove after tick
    //     // remove from filters
    // }

    registerEntity(entity: Entity) {
        // Add component handler to entity
        entity.registerAddComponentCallback((components) => this.trackNewComponents(entity.id, components))

        this.entitiesById.set(entity.id, entity)

        if (entity.size()) {
            this.trackNewComponents(entity.id, entity.getComponents())
        }

        this.stats.entities += 1
    }

    registerFilter(filter: Query) {
        const existingEntities = this.entitiesByFilter.get(filter)

        if (existingEntities) {
            return existingEntities
        }

        // Setup new entity set for the filter
        const entitySet = new Set<Entity>()

        // TODO replace with an iter.filter() when browsers support
        // Go through all entities and add matching ones to the new set
        for (const entity of this.entitiesById.values()) {
            if (filter.match(entity)) {
                entitySet.add(entity)
            }
        }

        // Update filter map
        this.entitiesByFilter.set(filter, entitySet)

        // Trigger existing listeners that their filters were updated
        if (this.listenersByFilter.has(filter)) {
            entitySet.forEach((entity) => {
                this.listenersByFilter.get(filter)?.forEach((cb) => cb(entity, filter))
            })
        }

        this.stats.filters = this.entitiesByFilter.size

        return entitySet
    }

    registerFilters(filters: Query[]) {
        filters.forEach((f) => this.registerFilter(f))
    }

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }
}
