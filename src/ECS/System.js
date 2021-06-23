export default class System {
    constructor() {
        // Map entity to map of component type to component
        this._components = new Map()
    }

    _saveComponent(component) {
        const { entity, type } = component
        if (!this._components.has(entity)) {
            this._components.set(entity, new Map())
        }
        this._components.get(entity).set(type, component)
    }

    _getComponent(entity, type) {
        if (!this._components.has(entity)) {
            return undefined
        }
        return this._components.get(entity).get(type)
    }
}
