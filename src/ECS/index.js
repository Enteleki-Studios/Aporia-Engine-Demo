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

    addComponents(components) {
        components.forEach((component) => this.addComponent(component))
    }

    registerSystem(system) {
        system.ECS = this
        this._systems.push(system)
    }

    start() {
        this._update()
    }

    _update() {
        requestAnimationFrame(() => {
            const delta = Math.min(this._clock.getDelta(), 500)

            try {
                this._systems.forEach((system) => system.tick(delta))
                this._update()
            } catch (error) {
                /* eslint-disable no-console, no-debugger */
                console.error(error)
                debugger
            }
        })
    }
}
