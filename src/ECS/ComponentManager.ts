import type { Component } from './Component'

type Entity = Map<string, Component>
type ComponentTuple = Component[]
type QueryResult = ComponentTuple[]

export class ComponentManager {
    #components: Component[]
    #entitiesById: Map<string, Entity>
    #queryCache: Map<string, QueryResult>

    constructor() {
        this.#components = []
        this.#entitiesById = new Map()
        this.#queryCache = new Map()
    }

    addComponent(component: Component) {
        const { entityId, type } = component

        if (this.#entitiesById.has(entityId)) {
            const entityMap = this.#entitiesById.get(entityId) as Entity
            if (entityMap.has(type)) {
                throw new Error(`Cannot add the same Component '${type}' to an Entity more than once`)
            } else {
                entityMap.set(type, component)
            }
        } else {
            this.#entitiesById.set(entityId, new Map([[type, component]]))
        }

        this.#components.push(component)
        this.#queryCache = new Map()
    }

    getTuplesByQuery(queryTypes: string[]) {
        const query = queryTypes.join('.')
        if (this.#queryCache.has(query)) {
            return this.#queryCache.get(query) as QueryResult
        }
        const tuples:QueryResult = []
        this.#entitiesById.forEach((entity: Entity) => {
            if (queryTypes.every((qt) => entity.has(qt))) {
                tuples.push(queryTypes.map((qt) => entity.get(qt) as Component))
            }
        })
        this.#queryCache.set(query, tuples)
        return tuples
    }

    getListEntityIDs(): string[] {
        const listEntities: string[] = []
        this.#entitiesById.forEach((entity, id) => listEntities.push(id))
        return listEntities
    }

    getComponentsSerialized() {
        const componentsSerialized:ReturnType<Component['serialize']>[] = []
        this.#components.forEach((component) => {
            componentsSerialized.push(component.serialize())
        })
        return componentsSerialized
    }
}
