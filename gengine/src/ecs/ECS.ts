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
    /** Number of registered filters */
    filters: number
    /** Array of last frame system stats */
    systemsStats: SystemStatsType[]
}

export class ECS {
    private entitiesById = new Map<EntityId, Entity>()
    private filters = new Set<ECSFilter>()
    private systems: System[] = []
    private systemsByFilter = new Map<ECSFilter, System[]>()

    stats: ECSStatsType = {
        entities: 0,
        components: 0,
        systems: 0,
        filters: 0,
        systemsStats: [],
    }

    private registerFilters(filters: ECSFilter[], system?: System) {
        filters.forEach((f) => this.filters.add(f))

        this.stats.filters = this.filters.size

        if (system) {
            filters.forEach((filter) => {
                if (this.systemsByFilter.has(filter)) {
                    this.systemsByFilter.get(filter)?.push(system)
                } else {
                    this.systemsByFilter.set(filter, [system])
                }
            })
        }
    }

    private updateFiltersForEntity(entity: Entity) {
        this.filters.forEach((filter) => {
            if (filter.match(entity)) {
                if (!filter.entities.has(entity)) {
                    filter.entities.add(entity)
                    this.systemsByFilter.get(filter)?.forEach((system) => {
                        system.receiveEntity(entity, filter)
                    })
                }
            } else {
                // TODO update systems when removed
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
    //     // remove from filters
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
        this.registerFilters(system.filters, system)
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
            const name = `System: ${s.constructor.name}`
            performance.mark(name)
            s.tick(world)
            this.stats.systemsStats[i].runtime = performance.measure(`${name} finish`, name).duration
        })
    }
}
