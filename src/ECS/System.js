export default class System {
    constructor(handles) {
        if (handles && handles.length) {
            this._handles = handles
        } else {
            throw new Error('Systems require Component handlers')
        }

        // Map entity to map of component type to component
        this._entityComponents = new Map()
        this._components = []
    }

    set ECS(ECS) {
        this._ECS = ECS
    }

    get handles() {
        return this._handles
    }

    _saveComponent(component) {
        const { entity, type } = component
        if (!this._entityComponents.has(entity)) {
            this._entityComponents.set(entity, new Map())
        }
        this._entityComponents.get(entity).set(type, component)
        this._components.push(component)
    }

    _hasComponent(entity, type) {
        if (!this._entityComponents.has(entity)) {
            return false
        }
        return this._entityComponents.get(entity).has(type)
    }

    _getComponent(entity, type) {
        return this._entityComponents.get(entity).get(type)
    }

    // eslint-disable-next-line
    tick() {
        return null
    }
}
