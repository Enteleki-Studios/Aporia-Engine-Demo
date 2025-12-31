import { describe, expect, test, vi } from 'vitest'

import { createComponent } from '@core'

import { Entity } from './entity'
import { createQuery } from './query'
import { QueryCache } from './queryCache'

const Position = createComponent('Position', (x: number, y: number) => ({ x, y }))
const Velocity = createComponent('Velocity', (x: number, y: number) => ({ x, y }))
const Health = createComponent('Health', (value: number) => ({ value }))

describe('QueryCache', () => {
    describe('onEntityUpdated', () => {
        test('adds entity to results when it matches query for the first time', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const results = queryCache.query(query)

            expect(results).toHaveLength(0)

            entity.add(Position(10, 20))
            queryCache.onEntityUpdated(entity)

            expect(results).toHaveLength(1)
            expect(results[0]?.[0][0]).toEqual(Position(10, 20))
            expect(results[0]?.[1]).toBe(entity)
        })

        test('runs effects when entity matches query for the first time', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const effect = vi.fn()
            queryCache.addQueryEffect(query, effect)

            entity.add(Position(10, 20))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)
            expect(effect).toHaveBeenCalledWith([[Position(10, 20)], entity])
        })

        test('re-runs effects when entity already matched and still matches', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entity.add(Velocity(1, 1))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const cleanup = vi.fn()
            const effect = vi.fn(() => cleanup)
            queryCache.addQueryEffect(query, effect)

            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)
            expect(cleanup).not.toHaveBeenCalled()

            entity.add(Position(15, 25))
            queryCache.onEntityUpdated(entity)

            expect(cleanup).toHaveBeenCalledTimes(1)
            expect(effect).toHaveBeenCalledTimes(2)
            expect(effect).toHaveBeenLastCalledWith([[Position(15, 25)], entity])
        })

        test('effect is called with new component when component is overwritten', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const effect = vi.fn()
            queryCache.addQueryEffect(query, effect)

            entity.add(Position(10, 20))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)

            entity.add(Position(15, 25))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(2)

            expect(effect).toHaveBeenLastCalledWith([[Position(15, 25)], entity])
        })

        test('removes entity from results when it no longer matches', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const results = queryCache.query(query)

            expect(results).toHaveLength(1)

            entity.delete(Position)
            queryCache.onEntityUpdated(entity)

            expect(results).toHaveLength(0)
        })

        test('calls cleanup when entity no longer matches', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const cleanup = vi.fn()
            const effect = vi.fn(() => cleanup)
            queryCache.addQueryEffect(query, effect)

            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)
            expect(cleanup).not.toHaveBeenCalled()

            entity.delete(Position)
            queryCache.onEntityUpdated(entity)

            expect(cleanup).toHaveBeenCalledTimes(1)
        })

        test('does nothing when entity does not and did not match', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Velocity(1, 1))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const effect = vi.fn()
            queryCache.addQueryEffect(query, effect)

            const results = queryCache.query(query)
            expect(results).toHaveLength(0)

            entity.add(Health(100))
            queryCache.onEntityUpdated(entity)

            expect(results).toHaveLength(0)
            expect(effect).not.toHaveBeenCalled()
        })

        test('handles multiple effects correctly when entity matches for first time', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const effect1 = vi.fn()
            const effect2 = vi.fn()
            queryCache.addQueryEffect(query, effect1)
            queryCache.addQueryEffect(query, effect2)

            entity.add(Position(10, 20))
            queryCache.onEntityUpdated(entity)

            expect(effect1).toHaveBeenCalledTimes(1)
            expect(effect2).toHaveBeenCalledTimes(1)
        })

        test('handles multiple effects correctly when entity is removed', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const cleanup1 = vi.fn()
            const cleanup2 = vi.fn()
            const effect1 = vi.fn(() => cleanup1)
            const effect2 = vi.fn(() => cleanup2)
            queryCache.addQueryEffect(query, effect1)
            queryCache.addQueryEffect(query, effect2)

            queryCache.onEntityUpdated(entity)

            entity.delete(Position)
            queryCache.onEntityUpdated(entity)

            expect(cleanup1).toHaveBeenCalledTimes(1)
            expect(cleanup2).toHaveBeenCalledTimes(1)
        })

        test('handles queries with multiple required components', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entities.set(entity.id, entity)

            const query = createQuery([Position, Velocity])
            const effect = vi.fn()
            queryCache.addQueryEffect(query, effect)

            expect(effect).not.toHaveBeenCalled()

            entity.add(Velocity(1, 1))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)
            expect(effect).toHaveBeenCalledWith([
                [Position(10, 20), Velocity(1, 1)],
                entity,
            ])
        })

        test('handles query filter predicate', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entity.add(Health(50))
            entities.set(entity.id, entity)

            const query = createQuery([Position, Health], (e) => {
                const health = e.get(Health)
                return health !== undefined && health.value > 75
            })
            const effect = vi.fn()
            queryCache.addQueryEffect(query, effect)

            expect(effect).not.toHaveBeenCalled()

            entity.add(Health(80))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)

            entity.add(Health(60))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(1)
        })

        test('handles effects that return null instead of cleanup function', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const effect = vi.fn(() => null)
            queryCache.addQueryEffect(query, effect)

            queryCache.onEntityUpdated(entity)

            entity.add(Position(15, 25))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(2)
        })

        test('handles effects that return undefined instead of cleanup function', () => {
            const entities = new Map<string, Entity>()
            const queryCache = new QueryCache(entities)

            const entity = new Entity('e1')
            entity.add(Position(10, 20))
            entities.set(entity.id, entity)

            const query = createQuery([Position])
            const effect = vi.fn()
            queryCache.addQueryEffect(query, effect)

            queryCache.onEntityUpdated(entity)

            entity.add(Position(15, 25))
            queryCache.onEntityUpdated(entity)

            expect(effect).toHaveBeenCalledTimes(2)
        })
    })
})
