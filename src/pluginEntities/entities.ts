import {
    type AnyComponent,
    type AnyComponentCreator,
} from '@enteleki-studios/aporia-engine-core'

import { Entity, type EntityId } from './entity'
import { type Query } from './query'
import { QueryCache, type QueryEffect, type QueryResult } from './queryCache'

export class Entities {
    private entities = new Map<EntityId, Entity>()
    private queryCache = new QueryCache(this.entities)

    get(entityId: EntityId) {
        return this.entities.get(entityId)
    }

    createEntity() {
        const entity = new Entity()
        this.entities.set(entity.id, entity)
        this.queryCache.onEntityUpdated(entity)
        return entity.id
    }

    addComponents(entityId: EntityId, ...components: AnyComponent[]) {
        const entity = this.entities.get(entityId)
        if (entity) {
            components.forEach((c) => {
                entity.add(c)
            })
            this.queryCache.onEntityUpdated(entity)
        }
    }

    removeComponents(entityId: EntityId, ...componentCreators: AnyComponentCreator[]) {
        const entity = this.entities.get(entityId)
        if (entity) {
            componentCreators.forEach((c) => {
                entity.delete(c)
            })
            this.queryCache.onEntityUpdated(entity)
        }
    }

    query<T extends readonly AnyComponentCreator[]>(query: Query<T>): QueryResult<T>[] {
        return this.queryCache.query(query)
    }

    queryFirst<T extends readonly AnyComponentCreator[]>(
        query: Query<T>,
    ): QueryResult<T> | null {
        return this.query(query)[0] ?? null
    }

    addQueryEffect<T extends readonly AnyComponentCreator[]>(
        query: Query<T>,
        effect: QueryEffect<T>,
    ) {
        this.queryCache.addQueryEffect(query, effect)
    }

    get size() {
        return this.entities.size
    }

    get numQueries() {
        return this.queryCache.size
    }
}
