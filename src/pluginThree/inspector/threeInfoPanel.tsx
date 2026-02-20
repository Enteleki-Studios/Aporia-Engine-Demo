import { useIntervalRender } from '@core/react'

import { Stack, TCell, TRow, Table } from '@inspector'

import { useThreeWorld } from '.'

export const ThreeInfoPanel = () => {
    useIntervalRender(100)

    const world = useThreeWorld()

    return (
        <Stack direction="row">
            <Table>
                <TRow>
                    <TCell>Calls</TCell>
                    <TCell>{world.three.renderer.renderer.info.render.calls}</TCell>
                </TRow>
                <TRow>
                    <TCell>Triangles</TCell>
                    <TCell>{world.three.renderer.renderer.info.render.triangles}</TCell>
                </TRow>
                <TRow>
                    <TCell>Textures</TCell>
                    <TCell>{world.three.renderer.renderer.info.memory.textures}</TCell>
                </TRow>
                <TRow>
                    <TCell>Geometries</TCell>
                    <TCell>{world.three.renderer.renderer.info.memory.geometries}</TCell>
                </TRow>
                <TRow>
                    <TCell>Programs</TCell>
                    <TCell>{world.three.renderer.renderer.info.programs?.length}</TCell>
                </TRow>
            </Table>
        </Stack>
    )
}
