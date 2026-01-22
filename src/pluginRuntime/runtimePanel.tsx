import type { WorldWithPlugin } from '@core'

import { type TypedUseWorld, useSmoothNumber, useWorld } from '@core/react'

import { useRenderSync } from '.'
import type { PluginRuntime } from './plugin'

export const useRuntimeWorld: TypedUseWorld<WorldWithPlugin<PluginRuntime>> = useWorld

export const RuntimePanel = () => {
    useRenderSync()
    const world = useRuntimeWorld()
    const { runtime, clock } = world

    const smoothFps = useSmoothNumber(clock.fps, 50)
    const smoothFrameLength = useSmoothNumber(clock.frameLength, 50)

    return (
        <div>
            <h3>Runtime</h3>
            <pre>FPS: {Math.floor(smoothFps)}</pre>
            <pre>Length: {smoothFrameLength.toFixed(1)}ms</pre>
            <pre>Frames: {clock.frames}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems: {runtime.systems.length}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems(debug): {runtime.debugSystems.length}</pre>
        </div>
    )
}
