import * as THREE from 'three'
import type { Component, System } from 'ECS'
import ComponentManager from './ComponentManager'

export class ECS {
    _lastEntityId: number
    ComponentManager: ComponentManager
    _clock: THREE.Clock
    _systems: System[]

    constructor() {
        this.ComponentManager = new ComponentManager()

        this._clock = new THREE.Clock()

        this._lastEntityId = 0

        this._systems = []
    }

    createEntity() {
        this._lastEntityId += 1
        return this._lastEntityId
    }

    addComponent(component: Component) {
        this.ComponentManager.addComponent(component)
    }

    addComponents(components: Component[]) {
        components.forEach((component) => this.addComponent(component))
    }

    registerSystem(system: System) {
        system.ECS = this
        this._systems.push(system)
    }

    start() {
        this._update()
    }

    _update() {
        requestAnimationFrame(() => {
            const delta = Math.min(this._clock.getDelta(), 0.050)
            // logger.debug('Delta', delta)

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
