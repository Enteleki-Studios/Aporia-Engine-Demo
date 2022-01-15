import * as THREE from 'three'
import type { Store } from 'redux'

import type { Component, System } from 'ECS'
import { actions } from './Inspector/redux'
import { ComponentManager } from './ComponentManager'

export class ECS {
    clock: THREE.Clock
    systems: System[] = []
    store?: Store

    ComponentManager: ComponentManager

    constructor() {
        this.clock = new THREE.Clock()
        this.ComponentManager = new ComponentManager()
    }

    addComponent(component: Component) {
        this.ComponentManager.addComponent(component)
        if (this.store) {
            this.store.dispatch(actions.updateEntities(this.ComponentManager.getListEntityIDs()))
            this.store.dispatch(actions.updateComponents(this.ComponentManager.getComponentsSerialized()))
        }
    }

    addComponents(components: Component[]) {
        components.forEach((component) => this.addComponent(component))
    }

    registerSystem(system: System) {
        system.ECS = this
        this.systems.push(system)
    }

    start() {
        this.update()
    }

    update() {
        requestAnimationFrame(() => {
            const delta = Math.min(this.clock.getDelta(), 0.050)

            try {
                this.systems.forEach((system) => system.tick(delta))
                this.update()
            } catch (error) {
                /* eslint-disable no-console */
                console.error(error)
            }
        })
    }

    addStore(store: Store) {
        this.store = store
    }
}
