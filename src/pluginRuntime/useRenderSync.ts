import { useEffect, useState } from 'react'

import { PluginsToResources, type System } from '@core'

import { type TypedUseWorld, useWorld } from '@core/react'

import { PluginClock } from '@pluginClock'

import { PluginRuntime } from './plugin'

export const useClockRuntimeWorld: TypedUseWorld<
    PluginsToResources<[PluginRuntime, PluginClock]>
> = useWorld

export const useRenderSync = () => {
    const world = useClockRuntimeWorld()
    const [_, setFrame] = useState(0)

    useEffect(() => {
        const onFrame: System<typeof world> = (w) => {
            setFrame(w.clock.frames)
        }

        world.runtime.addDebugSystem(onFrame)

        return () => {
            world.runtime.removeDebugSystem(onFrame)
        }
    }, [world])
}
