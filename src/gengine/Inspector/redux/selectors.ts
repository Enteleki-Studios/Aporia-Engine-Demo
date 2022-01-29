import { createSelector } from '@reduxjs/toolkit'
import type { State, Components } from '.'

export const getEntities = (state: State) => state.inspector.entities
export const getComponents = (state: State) => state.inspector.components

export const getComponentsByEntity = createSelector(
    getComponents,
    (components: Components) => {
        const componentsByEntity: { [key: string]: string[] } = {}
        components.forEach((c) => {
            if (componentsByEntity[c.entityId]) {
                componentsByEntity[c.entityId].push(c.type)
            } else {
                componentsByEntity[c.entityId] = [c.type]
            }
        })
        return componentsByEntity
    },
)
