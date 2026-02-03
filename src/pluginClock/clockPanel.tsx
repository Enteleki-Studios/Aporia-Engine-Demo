import type { PluginsToResources } from '@core'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import type { PluginClock } from '@pluginClock'

type RuntimePanelWorld = PluginsToResources<[PluginClock]>

export const useClockWorld: TypedUseWorld<RuntimePanelWorld> = useWorld

export const ClockPanel = () => {
    useIntervalRender(100)
    const world = useClockWorld()
    const { clock } = world

    return (
        <div>
            <h3>Clock</h3>
            <pre>FPS: {clock.fps}</pre>
            <pre>True delta: {clock.trueDelta}</pre>
            <pre>Delta: {clock.delta}</pre>
            <pre>Length: {clock.frameLength.toFixed(1)}ms</pre>
            <pre>Frames: {clock.frames}</pre>
        </div>
    )
}
