import type { World } from '../World'

import { Component, ECSFilter, Entity, EntityId, System } from 'ecs'

type SystemStatsType = {
    /** Provided system label */
    label: string
    /** How long it took to run the system last frame (ms) */
    runtime: number
    /** Exta debug information provided by the system */
    extra: Record<string, string | number | boolean>
}

type FilterListenerCallback = (entity: Entity, filter: ECSFilter) => void

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
    systemsStats: Record<string, SystemStatsType>
}

const EMPTY_SET = Object.freeze(new Set<Entity>())

export class ECS {
    private systems: System[] = []
    private entitiesById = new Map<EntityId, Entity>()
    private entitiesByFilter = new Map<ECSFilter, Set<Entity>>()
    private listenersByFilter = new Map<ECSFilter, Set<FilterListenerCallback>>()

    stats: ECSStatsType = {
        entities: 0,
        components: 0,
        systems: 0,
        filters: 0,
        systemsStats: {},
    }

    private updateFiltersForEntity(entity: Entity) {
        this.entitiesByFilter.forEach((entities, filter) => {
            if (filter.match(entity)) {
                if (!entities.has(entity)) {
                    entities.add(entity)

                    this.listenersByFilter.get(filter)?.forEach((cb) => cb(entity, filter))
                }
            } else {
                // TODO tell systems that entity was removed
                entities.delete(entity)
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

    filterBy(filter: ECSFilter): Set<Entity> {
        const entities = this.entitiesByFilter.get(filter)
        if (entities) {
            return entities
        } else {
            // eslint-disable-next-line no-console
            console.warn(`Filter ${filter.toString()} is not registered with the ECS`)
            return EMPTY_SET
        }
    }

    addFilterListener(filter: ECSFilter, cb: FilterListenerCallback) {
        if (!this.listenersByFilter.has(filter)) {
            this.listenersByFilter.set(filter, new Set())
        }
        this.listenersByFilter.get(filter)?.add(cb)
    }

    removeFilterListener(filter: ECSFilter, cb: FilterListenerCallback) {
        this.listenersByFilter.get(filter)?.delete(cb)
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
        this.stats.systemsStats[system.label] = {
            label: system.label,
            runtime: 0,
            extra: {},
        }
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

    getEntity(entityId: EntityId) {
        return this.entitiesById.get(entityId)
    }

    /** @internal */
    tick(world: World) {
        this.systems.forEach((system) => {
            const name = `System: ${system.label}`
            performance.mark(name)
            system(world)
            this.stats.systemsStats[system.label].runtime = Math.floor(
                performance.measure(`${name} finish`, name).duration,
            )
        })
    }
}
