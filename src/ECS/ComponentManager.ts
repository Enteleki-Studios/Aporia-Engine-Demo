import { Component } from './Component'

export default class ComponentManager {
    #components: Component[]
    #componentsByEntity: Map<number, Map<string, Component>>
    #queryCache: Map<string, Component[][]>

    constructor() {
        this.#components = []
        this.#componentsByEntity = new Map()
        this.#queryCache = new Map()
    }

    addComponent(component: Component) {
        const { entity, type } = component

        if (this.#componentsByEntity.has(entity)) {
            const entityMap = this.#componentsByEntity.get(entity) as Map<string, Component>
            if (entityMap.has(type)) {
                throw new Error(`Cannot add the same Component '${type}' to an Entity more than once`)
            } else {
                entityMap.set(type, component)
            }
        } else {
            this.#componentsByEntity.set(component.entity, new Map([[type, component]]))
        }

        this.#components.push(component)
        this.#queryCache = new Map()
    }

    getTuplesByQuery(queryTypes: string[]) {
        const query = queryTypes.join('.')
        if (this.#queryCache.has(query)) {
            return this.#queryCache.get(query) as Component[][]
        }
        const tuples:Component[][] = []
        this.#componentsByEntity.forEach((entity: Map<string, Component>) => {
            if (queryTypes.every((qt) => entity.has(qt))) {
                tuples.push(queryTypes.map((qt) => entity.get(qt) as Component))
            }
        })
        this.#queryCache.set(query, tuples)
        return tuples
    }
}
