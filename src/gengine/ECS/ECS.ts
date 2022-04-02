import type { Store } from 'redux'

import type { Component } from 'gengine'
import { actions } from '../Inspector/redux'
import type { ComponentManager } from './ComponentManager'

export class ECS {
    store?: Store

    ComponentManager: ComponentManager

    constructor(componentManager: ComponentManager) {
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
}
