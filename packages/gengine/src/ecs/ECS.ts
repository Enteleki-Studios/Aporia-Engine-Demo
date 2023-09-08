import type { World } from '../World'

import type { Component } from './Component'
import { ECSFilter } from './ECSFilter'
import { Entity, EntityId } from './Entity'
import { System } from './System'

type SystemStatsType = {
    /** System name pulled from its constructor */
    name: string
    /** How long it took to run the system last frame (ms) */
    runtime: number
}

export type ECSStatsType = {
    /** Number of entities */
    entities: number
    /** Number of components */
    components: number
    /** Number of active systems */
    systems: number
    /** Number of registered filters */
    filters: number
    /** Array of last frame system stats */
    systemsStats: SystemStatsType[]
}

export class ECS {
    private entitiesById = new Map<EntityId, Entity>()
    private systems: System[] = []
    // TODO: Remove this soon
    // private systemsByFilter = new Map<ECSFilter, System[]>()

    entitiesByFilter = new Map<ECSFilter, Set<Entity>>()

    stats: ECSStatsType = {
        entities: 0,
        components: 0,
        systems: 0,
        filters: 0,
        systemsStats: [],
    }

    // TODO add temp method that allows a system to register
    // a receiveEntity listener

    private updateFiltersForEntity(entity: Entity) {
        this.entitiesByFilter.forEach((entities, filter) => {
            if (filter.match(entity)) {
                if (!entities.has(entity)) {
                    entities.add(entity)
                    // this.systemsByFilter.get(filter)?.forEach((system) => {
                    //     system.receiveEntity?.(entity, filter)
                    // })
                }
            } else {
                // TODO tell systems that entity was removed
                filter.entities.delete(entity)
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

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }

    // removeEntity(entityId: EntityId) {
    //     // TODO queue and remove after tick
    //     // remove from filters
    // }

    registerEntity(entity: Entity) {
        // Inject add component handler to entity
        entity.onAddComponents = (components) => this.trackNewComponents(entity.id, components)

        this.entitiesById.set(entity.id, entity)

        if (entity.size()) {
            this.trackNewComponents(entity.id, entity.getComponents())
        }

        this.stats.entities += 1
    }

    registerSystem(system: System) {
        this.systems.push(system)

        this.stats.systems = this.systems.length
        this.stats.systemsStats.push({
            name: system.constructor.name,
            runtime: 0,
        })
    }

    registerFilter(filter: ECSFilter) {
        if (!this.entitiesByFilter.has(filter)) {
            this.entitiesByFilter.set(filter, new Set<Entity>())
        }

        this.stats.filters = this.entitiesByFilter.size
    }

    registerSystems(systems: System[]) {
        systems.forEach((s) => this.registerSystem(s))
    }

    registerFilters(filters: ECSFilter[]) {
        filters.forEach((f) => this.registerFilter(f))
    }

    /** @internal */
    tick(world: World) {
        this.systems.forEach((s, i) => {
            const name = `System: ${s.constructor.name}`
            performance.mark(name)
            if ('tick' in s) {
                s.tick(world)
            } else {
                s(world)
            }
            this.stats.systemsStats[i].runtime = performance.measure(`${name} finish`, name).duration
        })
    }
}
