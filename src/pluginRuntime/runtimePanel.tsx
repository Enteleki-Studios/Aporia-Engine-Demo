import { useCallback } from 'react'

import type { Runtime } from '@core'

import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { Button, Stack, TCell, TRow, Table } from '@inspector'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Panel only needs the runtime field; world parametrization is irrelevant here
export const useRuntimeWorld: TypedUseWorld<{ runtime: Runtime<any> }> = useWorld

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
                    {/* @ts-expect-error Accessing a private prop */}
                    <TCell>{runtime.systems.length}</TCell>
                </TRow>
                <TRow>
                    <TCell>Debug systems</TCell>
                    {/* @ts-expect-error Accessing a private prop */}
                    <TCell>{runtime.debugSystems.length}</TCell>
                </TRow>
                <TRow>
                    <TCell>Tasks</TCell>
                    {/* @ts-expect-error Accessing a private prop */}
                    <TCell>{runtime.tasks.length}</TCell>
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
