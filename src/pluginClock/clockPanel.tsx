import type { PluginsToResources } from '@core'

import { type TypedUseWorld, useSmoothNumber, useWorld } from '@core/react'

import type { PluginClock } from '@pluginClock'
import { useRenderSync } from '@pluginRuntime'

type RuntimePanelWorld = PluginsToResources<[PluginClock]>

export const useClockWorld: TypedUseWorld<RuntimePanelWorld> = useWorld

export const ClockPanel = () => {
    useRenderSync()
    const world = useClockWorld()
    const { clock } = world

    const smoothFps = useSmoothNumber(clock.fps, 50)
    const smoothFrameLength = useSmoothNumber(clock.frameLength, 50)

    return (
        <div>
            <h3>Clock</h3>
            <pre>FPS: {Math.floor(smoothFps)}</pre>
            <pre>Length: {smoothFrameLength.toFixed(1)}ms</pre>
            <pre>Frames: {clock.frames}</pre>
        </div>
    )
}
