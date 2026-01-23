import type { PluginsToResources } from '@core'

import { type TypedUseWorld, useWorld } from '@core/react'

import { useRenderSync } from '.'
import type { PluginRuntime } from './plugin'

export const useRuntimeWorld: TypedUseWorld<PluginsToResources<[PluginRuntime]>> =
    useWorld

export const RuntimePanel = () => {
    useRenderSync()
    const world = useRuntimeWorld()
    const { runtime } = world

    return (
        <div>
            <h3>Runtime</h3>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems: {runtime.systems.length}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems(debug): {runtime.debugSystems.length}</pre>
        </div>
    )
}
