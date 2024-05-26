import { AnyComponentCreator, Component, Entity, EntityId } from 'core'
import { Query } from 'definitions'

type QueryObserver = (entity: Entity, query: Query) => void

type QueryResult = Set<Entity>

export type ECSStatsType = {
    /** Number of entities */
    entities: number
    /** Number of components */
    // components: number
    /** Number of registered queries */
    queries: number
}

export class EntityManager {
    // Internal state
    private entitiesById = new Map<EntityId, Entity>()
    private queryResults = new Map<Query, QueryResult>() 
    private queryMatchObservers = new Map<Query, Set<QueryObserver>>()
    private queryUnMatchObservers = new Map<Query, Set<QueryObserver>>()

    // Queues waiting for flush
    private dirtyEntities = new Set<Entity>()
    private removedEntities = new Set<Entity>()
    private queuedComponents = new Map<Entity, Component[]>()
    private removedComponents = new Map<Entity, AnyComponentCreator[]>()

    stats: ECSStatsType = {
        entities: 0,
        queries: 0,
    }

    // TODO: DEPRECATE {{{
    filterBy(filter: Query): QueryResult {
        return this.query(filter)
    }

    addFilterListener(filter: Query, cb: QueryObserver) {
        return this.onQueryMatch(filter, cb)
    }
    // }}}

    private updateQueryResultsForEntity(entity: Entity) {
        this.queryResults.forEach((queryResult, query) => {
            if (query.match(entity)) {
                if (!queryResult.has(entity)) {
                    queryResult.add(entity)
                    this.queryMatchObservers.get(query)?.forEach((cb) => cb(entity, query))
                }
            } else {
                if (queryResult.has(entity)) {
                    queryResult.delete(entity)
                    this.queryUnMatchObservers.get(query)?.forEach((cb) => cb(entity, query))
                }
            }
        })
    }

    query(query: Query): QueryResult {
        const existingResult = this.queryResults.get(query)

        if (existingResult) {
            return existingResult
        }

        // Setup new entity set for the query
        const queryResult = new Set<Entity>()

        // TODO replace with an iter.filter() when browsers support
        // Go through all entities and add matching ones to the new set
        for (const [, entity] of this.entitiesById) {
            if (query.match(entity)) {
                queryResult.add(entity)
            }
        }

        // Update query map
        this.queryResults.set(query, queryResult)

        this.stats.queries = this.queryResults.size

        return queryResult
    }

    onQueryMatch(query: Query, cb: QueryObserver) {
        const existingObservers = this.queryMatchObservers.get(query)
        if (existingObservers) {
            existingObservers.add(cb)
        } else {
            this.queryMatchObservers.set(query, new Set([cb]))
        }

        // TODO: Should this be how it works? Or should plugins
        // do this manually with a query?
        // Trigger the callback for all existing entities
        this.query(query).forEach((entity) => {
            cb(entity, query)
        })

    }

    onQueryUnMatch(query: Query, cb: QueryObserver) {
        const existingObservers = this.queryUnMatchObservers.get(query)
        if (existingObservers) {
            existingObservers.add(cb)
        } else {
            this.queryUnMatchObservers.set(query, new Set([cb]))
        }
    }

    addEntity(entity: Entity) {
        this.entitiesById.set(entity.id, entity)

        this.dirty(entity)

        this.stats.entities += 1
    }

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }

    removeEntity(entity: Entity) {
        this.entitiesById.delete(entity.id)

        // Account for components being added, but then
        // the entity is deleted
        this.queuedComponents.delete(entity)
        this.removedComponents.delete(entity)

        this.removedEntities.add(entity)

        this.stats.entities -= 1
    }

    addComponent(entity: Entity, component: Component) {
        if (this.entitiesById.has(entity.id)) {
            const componentQueue = this.queuedComponents.get(entity)
            if (componentQueue) {
                componentQueue.push(component)
            } else {
                this.queuedComponents.set(entity, [component])
            }
            return true
        }

        return false
    }

    removeComponent(entity: Entity, componentCreator: AnyComponentCreator) {
        if (this.entitiesById.has(entity.id)) {
            const componentQueue = this.removedComponents.get(entity)
            if (componentQueue) {
                componentQueue.push(componentCreator)
            } else {
                this.removedComponents.set(entity, [componentCreator])
            }

            return true
        }

        return false
    }

    dirty(entity: Entity) {
        this.dirtyEntities.add(entity)
    }

    flush() {
        if (this.removedEntities.size) {
            // TODO: technically a query that always returns true
            // would cause entities to be retained
            for (const entity of this.removedEntities) {
                entity.clear()
                this.dirty(entity)
            }
            this.removedEntities.clear()
        }

        if (this.queuedComponents.size) {
            for (const [entity, components] of this.queuedComponents) {
                entity.addComponents(...components)
                this.dirty(entity)
            }
            this.queuedComponents.clear()
        }

        if (this.removedComponents.size) {
            for (const [entity, componentCreators] of this.removedComponents) {
                entity.removeComponents(...componentCreators)
                this.dirty(entity)
            }
            this.removedComponents.clear()
        }

        if (this.dirtyEntities.size) {
            for (const entity of this.dirtyEntities) {
                this.updateQueryResultsForEntity(entity)
            }
            this.dirtyEntities.clear()
        }
    }
}
