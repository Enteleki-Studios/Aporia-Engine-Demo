import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import type { PluginsToResources } from '@enteleki-studios/aporia-engine-core'
import { Stack, TBody, TCell, TRow, Table } from '@inspector'
import type { PluginClock } from '@pluginClock'

type RuntimePanelWorld = PluginsToResources<[PluginClock]>

export const useClockWorld: TypedUseWorld<RuntimePanelWorld> = useWorld

export const ClockPanel = () => {
    useIntervalRender(100)
    const world = useClockWorld()
    const { clock } = world

    return (
        <Stack>
            <h3>Clock</h3>
            <Table>
                <TBody>
                    <TRow>
                        <TCell>FPS</TCell>
                        <TCell>{clock.fps}</TCell>
                    </TRow>
                    <TRow>
                        <TCell>True delta</TCell>
                        <TCell> {clock.trueDelta.toFixed(3)}s</TCell>
                    </TRow>
                    <TRow>
                        <TCell>Delta</TCell>
                        <TCell> {clock.delta.toFixed(3)}s</TCell>
                    </TRow>
                    <TRow>
                        <TCell>Length</TCell>
                        <TCell> {clock.frameLength.toFixed(1)}ms</TCell>
                    </TRow>
                    <TRow>
                        <TCell>Frames</TCell>
                        <TCell> {clock.frames}</TCell>
                    </TRow>
                </TBody>
            </Table>
        </Stack>
    )
}
