export default class ComponentManager {
    constructor() {
        this._components = []
        this._componentsByEntity = new Map()
        this._queryCache = new Map()
    }

    addComponent(component) {
        const { entity, type } = component
        if (!entity || !type) {
            throw new Error('Component missing entity or type', component)
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

    getTuplesByQuery(queryTypes) {
        const query = queryTypes.join('.')
        if (this._queryCache.has(query)) {
            return this._queryCache.get(query)
        }
        const tuples = []
        this._componentsByEntity.forEach((entity) => {
            if (queryTypes.every((qt) => entity.has(qt))) {
                tuples.push(queryTypes.map((qt) => entity.get(qt)))
            }
        })
        this._queryCache.set(query, tuples)
        return tuples
    }
}
