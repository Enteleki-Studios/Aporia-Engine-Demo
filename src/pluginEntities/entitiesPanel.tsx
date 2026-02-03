import type { WorldWithPlugin } from '@core'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import type { PluginEntities } from '@pluginEntities'

const useEntitiesWorld: TypedUseWorld<WorldWithPlugin<PluginEntities>> = useWorld

export const EntitiesPanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useIntervalRender(100)
    const world = useEntitiesWorld()

    return (
        <div>
            <h3>Entities</h3>
            <pre>Entities: {world.entities.size}</pre>
            <pre>Queries: {world.entities.numQueries}</pre>
        </div>
    )
}
