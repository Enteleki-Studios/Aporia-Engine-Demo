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

type QueryEffectCleanup = () => void

type QueryEffect<
T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = (result: QueryResult<T>) => void | null | QueryEffectCleanup

type QueryCacheEntry<
T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = {
    results: QueryResult<T>[]
    effects: QueryEffect<T>[]
    cleanups: (null | (() => void))[]
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
        effects: [],
        cleanups: [],
    }))

    private updateQueryResultsForEntity(entity: Entity) {
        this.queryCache.forEach((cacheEntry, query) => {
            const { results, effects, cleanups } = cacheEntry

            const resultIndex = results.findIndex((res) => res[1] === entity)
            // TODO: Adding an effect after cleanups have been created
            // will change the value of effects.length and mess up all
            // of the offsets used to find cleanups. Consider saving cleanups
            // with effects using tuples instead of as an array sibling
            if (entityMatchesQuery(entity, query)) {
                // Entity matches for the first time
                if (resultIndex < 0) {
                    const newResult = entityToQueryResult(entity, query)
                    results.push(newResult)
                    const newResultIndex = results.length
                    const cleanupOffset = newResultIndex * effects.length
                    effects.forEach((effect, i) => {
                        const cleanupIndex = cleanupOffset + i
                        const cleanup = effect(newResult)
                        cleanups[cleanupIndex] = cleanup ?? null
                    })
                }
                // Entity already matched
                else {
                    const result = results[resultIndex]

                    if (result) { // Always true
                        const cleanupOffset = resultIndex * effects.length
                        effects.forEach((effect, i) => {
                            // Run corresponding cleanup first
                            const cleanupIndex = cleanupOffset + i
                            cleanups[cleanupIndex]?.()

                            // Call the effect and save the cleanup function
                            const cleanup = effect(result)
                            cleanups[cleanupIndex] = cleanup ?? null
                        })
                    }
                }
            } else {
                // Entity needs to be removed from results
                if (resultIndex >= 0) {
                    results.splice(resultIndex, 1)
                    const removedCleanups = cleanups.splice(resultIndex * effects.length, effects.length)
                    removedCleanups.forEach((cleanup) => {
                        cleanup?.()
                    })
                }
                // Ignore Entities that do not and did not match
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
        effect: QueryEffect<T>,
    ) {
        const [cacheEntry] = this.queryCache.getOrCreate(query)

        ;(cacheEntry as QueryCacheEntry<T>).effects.push(effect)
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
