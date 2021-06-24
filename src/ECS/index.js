import ComponentManager from 'ECS/ComponentManager'

export default class ECS {
    constructor() {
        this._ComponentManager = new ComponentManager()

        this._lastEntityId = 0

        this._systems = []
        this._componentHandlers = {}
        this._eventHandlers = new Map()
    }

    createEntity() {
        this._lastEntityId += 1
        return this._lastEntityId
    }

    addComponent(component) {
        this._ComponentManager.addComponent(component)

        const systems = this._componentHandlers[component.type]
        if (systems) {
            systems.forEach((system) => system.addComponent(component))
        } else {
            throw new Error(`No Systems handle Component type '${component.type}'`)
        }
    }

    registerSystem(system) {
        system.handles.forEach((handle) => {
            if (!this._componentHandlers[handle]) {
                this._componentHandlers[handle] = []
            }

            this._componentHandlers[handle].push(system)
        })
        system.ECS = this
        this._systems.push(system)
    }

    addEventListener(eventName, cb) {
        if (this._eventHandlers.has(eventName)) {
            this._eventHandlers.get(eventName).push(cb)
        } else {
            this._eventHandlers.set(eventName, [cb])
        }
    }

    broadcastEvent(event) {
        const eventHandlers = this._eventHandlers.get(event.name)
        if (eventHandlers) {
            eventHandlers.forEach((cb) => cb(event))
        }
    }

    // _update() {
    //     requestAnimationFrame(() => {
    //         const delta = this._clock.getDelta()
    //         this._update()

    //         this._systems.forEach((system) => system.update(delta))
    //     })
    // }
}
