import { v4 as uuid } from 'uuid'

import type { AnyComponent, AnyComponentCreator, ComponentKey } from './createComponent'
import { ObjectStore } from './objectStore'

type Query = (entity: Entity) => boolean
type QueryObserver = (entity: Entity) => void
type QueryCacheEntry = {
    results: Set<Entity>
    onMatchObservers: Set<QueryObserver>
    onUnMatchObservers: Set<QueryObserver>
}
type QueryCache = ObjectStore<Query, QueryCacheEntry>

type EntityId = string
type EntityMap = Map<EntityId, Entity>

class Entities {
    private entities: EntityMap = new Map()
    private queryCache: QueryCache = new ObjectStore(() => ({
        results: new Set(),
        onMatchObservers: new Set(),
        onUnMatchObservers: new Set(),
    }))

    private updateQueryResultsForEntity(entity: Entity) {
        this.queryCache.forEach((cacheEntry, query) => {
            const { results, onMatchObservers, onUnMatchObservers } = cacheEntry

            if (query(entity)) {
                if (!results.has(entity)) {
                    results.add(entity)
                    onMatchObservers.forEach((cb) => {
                        cb(entity)
                    })
                }
            } else {
                if (results.has(entity)) {
                    results.delete(entity)
                    onUnMatchObservers.forEach((cb) => {
                        cb(entity)
                    })
                }
            }
        })
    }
    get(entityId: EntityId) {
        return this.entities.get(entityId)
    }

    createEntity() {
        const entity = new Entity()
        this.entities.set(entity.id, entity)
        return entity.id
    }

    addComponents(entityId: EntityId, ...components: AnyComponent[]) {
        const entity = this.entities.get(entityId)
        if (entity) {
            components.forEach((c) => {
                entity.set(c)
            })
            this.updateQueryResultsForEntity(entity)
        }
    }

    removeComponents(entityId: EntityId, ...componentCreators: AnyComponentCreator[]) {
        const entity = this.entities.get(entityId)
        if (entity) {
            componentCreators.forEach((c) => {
                entity.delete(c)
            })
            this.updateQueryResultsForEntity(entity)
        }
    }

    query(query: Query): Set<Entity> {
        const cacheEntry = this.queryCache.get(query)

        if (cacheEntry) {
            return cacheEntry.results
        }

        const results = new Set(this.entities.values().filter(query))

        this.queryCache.create(query).results = results

        return results
    }

    addQueryObserver(query: Query, onMatch?: QueryObserver, onUnMatch?: QueryObserver) {
        const [cacheEntry] = this.queryCache.getOrCreate(query)

        if (onMatch) {
            cacheEntry.onMatchObservers.add(onMatch)
        }
        if (onUnMatch) {
            cacheEntry.onUnMatchObservers.add(onUnMatch)
        }
    }
}

class Entity {
    id: EntityId

    private components = new Map<ComponentKey, AnyComponent>()

    constructor(id?: EntityId) {
        this.id = id ?? uuid()
    }

    set(component: AnyComponent) {
        this.components.set(component.__key__, component)
    }

    has(componentCreator: AnyComponentCreator) {
        return this.components.has(componentCreator.__key__)
    }

    delete(componentCreator: AnyComponentCreator) {
        this.components.delete(componentCreator.__key__)
    }

    get<C extends AnyComponentCreator>(component: C) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Required assertion
        return this.components.get(component.__key__) as ReturnType<C> | undefined
    }
}

export const createQuery = (query: Query) => query

export const pluginEntities = () => ({
    setup: () => ({
        entities: new Entities(),
    }),
})
