import { type AnyComponentCreator } from '@core'

import { type Entity } from './entity'

type FilterPredicate = (entity: Entity) => boolean

export type Query<
    T extends readonly AnyComponentCreator[] = readonly AnyComponentCreator[],
> = {
    requires: T
    filter?: FilterPredicate | undefined
}

export const createQuery = <const T extends readonly AnyComponentCreator[]>(
    requires: T,
    filter?: FilterPredicate,
): Query<T> => ({
    requires,
    filter,
})

export const entityMatchesQuery = (entity: Entity, query: Query) =>
    entity.hasEvery(query.requires) && (query.filter?.(entity) ?? true)
