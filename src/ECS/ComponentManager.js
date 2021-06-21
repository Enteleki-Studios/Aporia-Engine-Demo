export default class ComponentManager {
    constructor(ECS) {
        this._ECS = ECS
        this.components = []
        this._componentsByEntity = {}
        this._componentsByType = {}
    }

    addComponent(component) {
        if (!component.entity || !component.type) {
            throw new Error('Component missing entity or type', component)
        }

        this.components.push(component)

        if (!this._componentsByEntity[component.entity]) {
            this._componentsByEntity[component.entity] = []
        }
        this._componentsByEntity[component.entity].push(component)

        if (!this._componentsByType[component.type]) {
            this._componentsByType[component.type] = []
        }
        this._componentsByType[component.type].push(component)
    }
}
