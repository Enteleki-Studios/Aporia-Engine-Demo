import ComponentManager from 'ECS/ComponentManager'

export default class ECS {
    constructor() {
        this._ComponentManager = new ComponentManager()

        this._lastEntityId = 0

        this._systems = []
        this._componentHandlers = {}
    }

    createEntity() {
        this._lastEntityId += 1
        return this._lastEntityId
    }

    addComponent(component) {
        this._ComponentManager.addComponent(component)

        const handlers = this._componentHandlers[component.type]
        if (handlers) {
            handlers.forEach((h) => h(component))
        }
    }

    registerSystem(system) {
        system.handlers.forEach((handler) => {
            if (!this._componentHandlers[handler[0]]) {
                this._componentHandlers[handler[0]] = []
            }

            this._componentHandlers[handler[0]].push(handler[1])
        })
        this._systems.push(system)
    }

    // _update() {
    //     requestAnimationFrame(() => {
    //         const delta = this._clock.getDelta()
    //         this._update()

    //         this._systems.forEach((system) => system.update(delta))
    //     })
    // }
}
