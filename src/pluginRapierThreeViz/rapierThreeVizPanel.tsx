import { useEffect } from 'react'

import { WorldWithPlugin } from '@enteleki-studios/aporia-engine-core'
import {
    type TypedUseWorld,
    usePersistentState,
    useWorld,
} from '@enteleki-studios/aporia-engine-core/react'
import { Checkbox, Panel, Stack } from '@inspector'

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
            <Stack>
                <h3>R3Viz</h3>
                <Checkbox checked={viz} onChange={handleToggleViz} switch>
                    Visualize physics world
                </Checkbox>
                <Checkbox checked={depth} onChange={handleToggleDepth} switch>
                    Disable depth test
                </Checkbox>
            </Stack>
        </Panel>
    )
}
