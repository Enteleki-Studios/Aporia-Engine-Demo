import { useCallback } from 'react'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import type { World } from '@enteleki-studios/aporia-engine-core'
import { Button, Stack, TCell, TRow, Table } from '@inspector'

export const useRuntimeWorld: TypedUseWorld<World<object>> = useWorld

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
            <Table>
                <TRow>
                    <TCell>Systems</TCell>
                    <TCell>{runtime.numSystems}</TCell>
                </TRow>
                <TRow>
                    <TCell>Debug systems</TCell>
                    <TCell>{runtime.numDebugSystems}</TCell>
                </TRow>
                <TRow>
                    <TCell>Tasks</TCell>
                    <TCell>{runtime.numTasks}</TCell>
                </TRow>
            </Table>
            <Stack direction="row">
                <Button onClick={handleTogglePlay}>
                    {world.runtime.isRunning ? 'stop' : 'play'}
                </Button>
                <Button onClick={handleStep} disabled={world.runtime.isRunning}>
                    step
                </Button>
            </Stack>
        </Stack>
    )
}
