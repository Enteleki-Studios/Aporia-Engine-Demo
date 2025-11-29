import type { WorldWithPlugin } from '@core'

import { type TypedUseWorld, useRenderSync, useWorld } from '@core/react'

import type { PluginEntities } from '@pluginEntities'

const useEntitiesWorld: TypedUseWorld<WorldWithPlugin<PluginEntities>> = useWorld

export const EntitiesPanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useRenderSync()
    const world = useEntitiesWorld()

    return (
        <div>
            <h3>Entities</h3>
            <pre>Entities: {world.resources.entities.size}</pre>
            <pre>Queries: {world.resources.entities.numQueries}</pre>
        </div>
    )
}
