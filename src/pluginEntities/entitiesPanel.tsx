import { WorldWithPlugins } from '@core'

import { TypedUseWorld, useRenderSync, useWorld } from '@core/react'

import { pluginEntities } from '@pluginEntities'

const useEntitiesWorld: TypedUseWorld<
    WorldWithPlugins<[ReturnType<typeof pluginEntities>]>
> = useWorld

export const EntitiesPanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useRenderSync()
    const world = useEntitiesWorld()

    return (
        <div>
            <h3>Entities</h3>
            <pre>Entities: {world.resources.entities.length}</pre>
        </div>
    )
}
