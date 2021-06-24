export default class ComponentManager {
    constructor() {
        this._components = []
        this._componentsByEntity = new Map()
    }

    addComponent(component) {
        const { entity, type } = component
        if (!entity || !type) {
            throw new Error('Component missing entity or type', component)
        }

        if (this._componentsByEntity.has(entity)) {
            if (this._componentsByEntity.get(entity).has(type)) {
                throw new Error(`Cannot add the saame Component '${type}' to an Entity more than once`)
            } else {
                this._componentsByEntity.get(entity).set(type, component)
            }
        } else {
            this._componentsByEntity.set(component.entity, new Map([[type, component]]))
        }

        this._components.push(component)
    }
}
