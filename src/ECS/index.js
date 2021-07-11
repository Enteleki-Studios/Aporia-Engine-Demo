import * as THREE from 'three'
import ComponentManager from 'ECS/ComponentManager'

export default class ECS {
    constructor() {
        this.ComponentManager = new ComponentManager()

        this._clock = new THREE.Clock()

        this._lastEntityId = 0

        this._systems = []
        this._eventHandlers = new Map()
    }

    createEntity() {
        this._lastEntityId += 1
        return this._lastEntityId
    }

    addComponent(component) {
        this.ComponentManager.addComponent(component)
    }

    registerSystem(system) {
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

    start() {
        this._update()
    }

    _update() {
        requestAnimationFrame(() => {
            const delta = this._clock.getDelta()
            this._update()

            try {
                this._systems.forEach((system) => system.tick(delta))
            } catch (error) {
                /* eslint-disable no-console, no-debugger */
                console.error(error)
                debugger
            }
        })
    }
}
