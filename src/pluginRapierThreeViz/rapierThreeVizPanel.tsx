import { useEffect } from 'react'

import { WorldWithPlugin } from '@core'

import { type TypedUseWorld, usePersistentState, useWorld } from '@core/react'

import { Panel, Stack, Toggle } from '@inspector'

import type { RapierThreeVizPlugin } from '.'

const useThreeWorld: TypedUseWorld<WorldWithPlugin<RapierThreeVizPlugin>> = useWorld

export const RapierThreeVizPanel = () => {
    const world = useThreeWorld()

    const [viz, setViz] = usePersistentState<boolean>('R3-viz', false)
    const [depth, setDepth] = usePersistentState<boolean>('R3-depth', false)

    useEffect(() => {
        world.rapierViz.api.toggleViz(viz)
    }, [world, viz])

    useEffect(() => {
        world.rapierViz.api.toggleDepthTest(!depth)
    }, [world, depth])

    const handleToggleViz = (next: boolean) => {
        setViz(next)
    }

    const handleToggleDepth = (next: boolean) => {
        setDepth(next)
    }

    return (
        <Panel>
            <h3>R3Viz</h3>
            <Stack>
                <Toggle checked={viz} onChange={handleToggleViz}>
                    Visualize physics world
                </Toggle>
                <Toggle checked={depth} onChange={handleToggleDepth}>
                    Disable depth test
                </Toggle>
            </Stack>
        </Panel>
    )
}
