import * as THREE from 'three'
import type { Store } from 'redux'

import type { Component, System } from 'gengine'
import { actions } from '../Inspector/redux'
import type { ComponentManager } from './ComponentManager'

export class ECS {
    clock: THREE.Clock
    systems: System[] = []
    store?: Store

    ComponentManager: ComponentManager

    constructor(componentManager: ComponentManager) {
        this.clock = new THREE.Clock()
        this.ComponentManager = componentManager
    }

    addComponent(component: Component) {
        this.ComponentManager.addComponent(component)

        this.store?.dispatch(actions.updateEntities(this.ComponentManager.getListEntityIDs()))
        this.store?.dispatch(actions.updateComponents(this.ComponentManager.getComponentsInspected()))
    }

    addComponents(components: Component[]) {
        components.forEach((component) => this.addComponent(component))
    }

    registerSystem(system: System) {
        system.ECS = this
        this.systems.push(system)
    }

    tick(delta: number) {
        this.systems.forEach((system) => system.tick(delta))
    }
}
// this.store.dispatch(actions.updateComponents(this.ComponentManager.getComponentsInspected()))
