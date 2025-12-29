/* eslint-disable @typescript-eslint/no-explicit-any -- library code */
/* eslint-disable @typescript-eslint/consistent-type-assertions -- library code */
import { type AnyComponentCreator } from '@core'

import { Entity, EntityId } from './entity'
import { type Query, entityMatchesQuery } from './query'

type ComponentsFromCreators<T extends readonly AnyComponentCreator[]> = {
    [K in keyof T]: T[K] extends AnyComponentCreator ? ReturnType<T[K]> : never
}

export type QueryResult<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = [ComponentsFromCreators<T>, Entity]

type QueryEffectCleanup = () => void

export type QueryEffect<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = (result: QueryResult<T>) => void | null | QueryEffectCleanup

type QueryCacheEntry<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = {
    results: QueryResult<T>[]
    effects: [QueryEffect<T>, (QueryEffectCleanup | null)[]][]
}

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

// TODO: It doesn't seem quite right that we are keeping
// a reference to entities saved here. Should this class deal
// only with caching queries and leave the filtering to something else?
// Also considering moving this to a plugin instead of being used through
// the Entities class.

export class QueryCache {
    private entities: Map<EntityId, Entity>
    private cache = new Map<Query<any>, QueryCacheEntry>()

    constructor(entities: Map<EntityId, Entity>) {
        this.entities = entities
    }

    private getOrCreateCacheEntry<T extends readonly AnyComponentCreator[]>(query: Query<T>): QueryCacheEntry<T> {
        const entry = this.cache.get(query)

        if (entry) {
            return entry as QueryCacheEntry<T>
        }

        const results = this.entities
            .values()
            .filter((entity) => entityMatchesQuery(entity, query))
            .map((entity) => entityToQueryResult(entity, query))
            .toArray() // TODO: Does this need to be an array or can it be an iterator?

        const newEntry = {
            results,
            effects: [],
        }

        this.cache.set(query, newEntry)

        return newEntry
    }

    onEntityUpdated(entity: Entity) {
        this.cache.forEach((cacheEntry, query) => {
            const { results, effects } = cacheEntry

            const resultIndex = results.findIndex((res) => res[1] === entity)

            if (entityMatchesQuery(entity, query)) {
                // Entity matches for the first time
                if (resultIndex < 0) {
                    const newResult = entityToQueryResult(entity, query)
                    const newResultIndex = results.push(newResult)
                    effects.forEach(([effect, cleanups]) => {
                        const cleanup = effect(newResult)
                        cleanups[newResultIndex] = cleanup ?? null
                    })
                }
                // Entity already matched
                else {
                    const result = results[resultIndex] // Should always exist at this point

                    effects.forEach(([effect, cleanups]) => {
                        cleanups[resultIndex]?.()
                        const newCleanup = result ? effect(result) ?? null : null
                        cleanups[resultIndex] = newCleanup
                    })
                }
            } else {
                // Entity needs to be removed from results
                if (resultIndex >= 0) {
                    results.splice(resultIndex, 1)
                    effects.forEach(([_, cleanups]) => {
                        const removedCleanups = cleanups.splice(resultIndex, 1)
                        // Should only run once (one cleanup is spliced out for each effect)
                        removedCleanups.forEach((cleanup) => {
                            cleanup?.()
                        })
                    })
                }
                // Ignore Entities that do not and did not match
            }
        })
    }

    addQueryEffect<T extends readonly AnyComponentCreator[]>(
        query: Query<T>,
        effect: QueryEffect<T>,
    ) {
        this.getOrCreateCacheEntry(query).effects.push([effect, []])
    }

    query<T extends readonly AnyComponentCreator[]>(query: Query<T>): QueryResult<T>[] {
        return this.getOrCreateCacheEntry(query).results
    }

    get size() {
        return this.cache.size
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any -- library code */
/* eslint-enable @typescript-eslint/consistent-type-assertions -- library code */
