import type { WorldWithPlugin } from '@enteleki-studios/aporia-engine-core'
import {
    type TypedUseWorld,
    useIntervalRender,
    useWorld,
} from '@enteleki-studios/aporia-engine-core/react'
import { Stack, TBody, TCell, TRow, Table } from '@inspector'
import type { PluginEntities } from '@pluginEntities'

const useEntitiesWorld: TypedUseWorld<WorldWithPlugin<PluginEntities>> = useWorld

export const EntitiesPanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useIntervalRender(100)
    const world = useEntitiesWorld()

    return (
        <Stack>
            <h3>Entities</h3>
            <Table>
                <TBody>
                    <TRow>
                        <TCell>Entities</TCell>
                        <TCell>{world.entities.size}</TCell>
                    </TRow>
                    <TRow>
                        <TCell>Queries</TCell>
                        <TCell>{world.entities.numQueries}</TCell>
                    </TRow>
                </TBody>
            </Table>
        </Stack>
    )
}
