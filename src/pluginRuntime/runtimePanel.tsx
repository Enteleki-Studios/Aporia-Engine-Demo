import { useCallback } from 'react'

import type { PluginsToResources } from '@core'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Button, ButtonBar, Stack } from '@inspector'

import type { PluginRuntime } from './plugin'

export const useRuntimeWorld: TypedUseWorld<PluginsToResources<[PluginRuntime]>> =
    useWorld

export const RuntimePanel = () => {
    useIntervalRender(500)
    const world = useRuntimeWorld()
    const { runtime } = world

    const handleTogglePlay = useCallback(() => {
        if (world.runtime.isRunning) {
            world.runtime.stop()
        } else {
            world.runtime.start()
        }
    }, [world])

    const handleStep = useCallback(() => {
        world.runtime.step()
    }, [world])

    return (
        <Stack>
            <h3>Runtime</h3>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems: {runtime.systems.length}</pre>
            {/* @ts-expect-error Accessing a private prop */}
            <pre>Systems(debug): {runtime.debugSystems.length}</pre>
            <ButtonBar>
                <Button onClick={handleTogglePlay}>
                    {world.runtime.isRunning ? 'stop' : 'play'}
                </Button>
                <Button onClick={handleStep} disabled={world.runtime.isRunning}>
                    step
                </Button>
            </ButtonBar>
        </Stack>
    )
}
