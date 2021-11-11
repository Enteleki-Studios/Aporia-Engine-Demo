import { Component } from './Component'

export default class ComponentManager {
    _components: Component[]
    _componentsByEntity: Map
    _queryCache: Map

    constructor() {
        this._components = []
        this._componentsByEntity = new Map()
        this._queryCache = new Map()
    }

    addComponent(component: Component) {
        const { entity, type } = component
        if (!entity || !type) {
            throw new Error('Component missing entity or type')
        }

        if (this._componentsByEntity.has(entity)) {
            if (this._componentsByEntity.get(entity).has(type)) {
                throw new Error(`Cannot add the same Component '${type}' to an Entity more than once`)
            } else {
                this._componentsByEntity.get(entity).set(type, component)
            }
        } else {
            this._componentsByEntity.set(component.entity, new Map([[type, component]]))
        }

        this._components.push(component)
        this._queryCache = new Map()
    }

    getTuplesByQuery(queryTypes: string[]) {
        const query = queryTypes.join('.')
        if (this._queryCache.has(query)) {
            return this._queryCache.get(query)
        }
        const tuples:Component[][] = []
        this._componentsByEntity.forEach((entity: number) => {
            if (queryTypes.every((qt) => entity.has(qt))) {
                tuples.push(queryTypes.map((qt) => entity.get(qt)))
            }
        })
        this._queryCache.set(query, tuples)
        return tuples
    }
}
