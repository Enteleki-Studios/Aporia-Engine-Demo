/* eslint-disable @typescript-eslint/no-explicit-any -- library code */
/* eslint-disable @typescript-eslint/consistent-type-assertions -- library code */
import { type AnyComponent, type AnyComponentCreator, ObjectStore } from '@core'

import { Entity, type EntityId } from './entity'
import { type Query, entityMatchesQuery } from './query'

type ComponentsFromCreators<T extends readonly AnyComponentCreator[]> = {
    [K in keyof T]: T[K] extends AnyComponentCreator ? ReturnType<T[K]> : never
}

type QueryResult<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = [ComponentsFromCreators<T>, Entity]

type QueryObserver<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = (result: QueryResult<T>) => void

type QueryCacheEntry<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = {
    results: QueryResult<T>[]
    onMatchObservers: Set<QueryObserver<T>>
    onUnMatchObservers: Set<QueryObserver<T>>
}
type QueryCache = ObjectStore<Query<any>, QueryCacheEntry>

const getComponentsAsTuple = <T extends readonly AnyComponentCreator[]>(
    entity: Entity,
    requires: T,
): ComponentsFromCreators<T> =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO: Refactor to remove this
    requires.map((r) => entity.get(r)!) as any as ComponentsFromCreators<T>

const entityToQueryResult = <T extends readonly AnyComponentCreator[]>(
    entity: Entity,
    query: Query<T>,
): QueryResult<T> => [getComponentsAsTuple(entity, query.requires), entity]

export class Entities {
    private entities = new Map<EntityId, Entity>()
    private queryCache: QueryCache = new ObjectStore(() => ({
        results: [],
        onMatchObservers: new Set(),
        onUnMatchObservers: new Set(),
    }))

    private updateQueryResultsForEntity(entity: Entity) {
        this.queryCache.forEach((cacheEntry, query) => {
            const { results, onMatchObservers, onUnMatchObservers } = cacheEntry
            const resultIndex = results.findIndex((res) => res[1] === entity)

            if (entityMatchesQuery(entity, query)) {
                if (resultIndex < 0) {
                    const newResult = entityToQueryResult(entity, query)
                    results.push(newResult)
                    onMatchObservers.forEach((cb) => {
                        cb(newResult)
                    })
                }
            } else {
                if (resultIndex >= 0) {
                    // TODO: Don't love the mutation + indexed access
                    const deletedResult = results.splice(resultIndex, 1)[0]
                    if (deletedResult) {
                        onUnMatchObservers.forEach((cb) => {
                            cb(deletedResult)
                        })
                    }
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
                entity.add(c)
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

    query<T extends readonly AnyComponentCreator[]>(query: Query<T>): QueryResult<T>[] {
        const cacheEntry = this.queryCache.get(query)

        if (cacheEntry) {
            return cacheEntry.results as QueryResult<T>[]
        }

        const results = this.entities
            .values()
            .filter((entity) => entityMatchesQuery(entity, query))
            .map((entity) => entityToQueryResult(entity, query))
            .toArray()

        this.queryCache.create(query).results = results as QueryResult<any>[]

        return results
    }

    queryFirst<T extends readonly AnyComponentCreator[]>(
        query: Query<T>,
    ): QueryResult<T> | null {
        return this.query(query)[0] ?? null
    }

    addQueryObserver<T extends readonly AnyComponentCreator[]>(
        query: Query<T>,
        onMatch?: QueryObserver<T>,
        onUnMatch?: QueryObserver<T>,
    ) {
        const [cacheEntry] = this.queryCache.getOrCreate(query)

        if (onMatch) {
            ;(cacheEntry as QueryCacheEntry<T>).onMatchObservers.add(onMatch)
        }
        if (onUnMatch) {
            ;(cacheEntry as QueryCacheEntry<T>).onUnMatchObservers.add(onUnMatch)
        }
    }

    get size() {
        return this.entities.size
    }

    get numQueries() {
        return this.queryCache.size
    }
}

/* eslint-enable @typescript-eslint/no-explicit-any -- library code */
/* eslint-enable @typescript-eslint/consistent-type-assertions -- library code */
