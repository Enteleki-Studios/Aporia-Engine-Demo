import { v4 as uuid } from 'uuid'
import type { World } from '../World'

import type { Component } from './Component'
import { ECSFilter } from './ECSFilter'
import { Entity, EntityId } from './Entity'
import { System } from './System'

interface SystemStatsType {
    /** System name pulled from its constructor */
    name: string
    /** How long it took to run the system last frame (ms) */
    runtime: number
}

export interface ECSStatsType {
    /** Number of entities */
    entities: number
    /** Number of components */
    components: number
    /** Number of active systems */
    systems: number
    /** Array of last frame system stats */
    systemsStats: SystemStatsType[]
}

export class ECS {
    private entitiesById = new Map<EntityId, Entity>()
    private filters = new Set<ECSFilter>()
    private systems: System[] = []

    stats: ECSStatsType = {
        entities: 0,
        components: 0,
        systems: 0,
        systemsStats: [],
    }

    private registerFilters(filters: ECSFilter[]) {
        filters.forEach((f) => this.filters.add(f))
    }

    private updateFiltersForEntity(entity: Entity) {
        this.filters.forEach((filter) => {
            if (entity.hasAll(filter.filterBy)) {
                filter.entities.add(entity)
            } else {
                filter.entities.delete(entity)
            }
        })
    }

    createEntity() {
        const id = uuid().toUpperCase()
        const entity = new Entity(id, this)

        this.entitiesById.set(id, entity)

        this.stats.entities += 1

        return entity
    }

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }

    // removeEntity(entityId: EntityId) {
    //     // TODO queue and remove after tick
    //     // remove from caches
    // }

    addComponents(entityId: EntityId, ...components: Component[]) {
        const entity = this.entitiesById.get(entityId)

        if (entity) {
            components.forEach((component) => {
                entity.addComponent_Unsafe(component)
                this.stats.components += 1
            })
            this.updateFiltersForEntity(entity)
        } else {
            throw new Error(`Entity does not exist ${entityId}`)
        }
    }

    registerSystem(system: System) {
        this.registerFilters(system.filters)
        this.systems.push(system)

        this.stats.systems += 1
        this.stats.systemsStats.push({
            name: system.constructor.name,
            runtime: 0,
        })
    }

    registerSystems(systems: System[]) {
        systems.forEach((s) => this.registerSystem(s))
    }

    /** @internal */
    tick(world: World) {
        this.systems.forEach((s, i) => {
            const t0 = performance.now()
            s.tick(world)
            this.stats.systemsStats[i].runtime = performance.now() - t0
        })
    }
}
