import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Stack, TBody, TCell, TRow, Table } from '@inspector'
import { ThreeWorld } from '@pluginThree'

const useThreeWorld: TypedUseWorld<ThreeWorld> = useWorld

export const ThreeInfoPanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useIntervalRender(100)
    const world = useThreeWorld()

    return (
        <Stack direction="row">
            <Table>
                <TBody>
                    <TRow>
                        <TCell>Calls</TCell>
                        <TCell>{world.three.renderer.renderer.info.render.calls}</TCell>
                    </TRow>
                    <TRow>
                        <TCell>Triangles</TCell>
                        <TCell>
                            {world.three.renderer.renderer.info.render.triangles}
                        </TCell>
                    </TRow>
                    <TRow>
                        <TCell>Textures</TCell>
                        <TCell>
                            {world.three.renderer.renderer.info.memory.textures}
                        </TCell>
                    </TRow>
                    <TRow>
                        <TCell>Geometries</TCell>
                        <TCell>
                            {world.three.renderer.renderer.info.memory.geometries}
                        </TCell>
                    </TRow>
                    <TRow>
                        <TCell>Programs</TCell>
                        <TCell>
                            {world.three.renderer.renderer.info.programs?.length}
                        </TCell>
                    </TRow>
                </TBody>
            </Table>
        </Stack>
    )
}
