import { Component, ECSFilter, Entity, EntityId } from 'core'

type FilterListenerCallback = (entity: Entity, filter: ECSFilter) => void

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
    private entitiesByFilter = new Map<ECSFilter, Set<Entity>>()
    private listenersByFilter = new Map<ECSFilter, Set<FilterListenerCallback>>()

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

    filterBy(filter: ECSFilter): Set<Entity> {
        const entities = this.entitiesByFilter.get(filter)
        if (entities) {
            return entities
        } else {
            return this.registerFilter(filter)
        }
    }

    addFilterListener(filter: ECSFilter, cb: FilterListenerCallback) {
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

    removeFilterListener(filter: ECSFilter, cb: FilterListenerCallback) {
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

    registerFilter(filter: ECSFilter) {
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

    registerFilters(filters: ECSFilter[]) {
        filters.forEach((f) => this.registerFilter(f))
    }

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }
}
