import { createSelector } from '@reduxjs/toolkit'
import type { State, Components } from '.'

export const getEntities = (state: State) => state.inspector.entities
export const getComponents = (state: State) => state.inspector.components

export const getDebugMode = (state: State) => state.inspector.debugMode

export const getComponentsByEntityId = createSelector(
    getComponents,
    (components: Components) => {
        const componentsByEntityId: { [key: string]: { [key: string]: string }[] } = {}
        components.forEach((c) => {
            if (componentsByEntityId[c.entityId]) {
                componentsByEntityId[c.entityId].push(c)
            } else {
                componentsByEntityId[c.entityId] = [c]
            }
        })
        return componentsByEntityId
    },
)
