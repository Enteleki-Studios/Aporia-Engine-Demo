export default class System {
    constructor(handles, ECS) {
        if (handles && handles.length) {
            this._handles = handles
        } else {
            throw new Error('Systems require Component handlers')
        }

        // Map entity to map of component type to component
        this._components = new Map()
        this._ECS = ECS
    }

    get handles() {
        return this._handles
    }

    _saveComponent(component) {
        const { entity, type } = component
        if (!this._components.has(entity)) {
            this._components.set(entity, new Map())
        }
        this._components.get(entity).set(type, component)
    }

    _hasComponent(entity, type) {
        if (!this._components.has(entity)) {
            return false
        }
        return this._components.get(entity).has(type)
    }

    _getComponent(entity, type) {
        return this._components.get(entity).get(type)
    }
}
