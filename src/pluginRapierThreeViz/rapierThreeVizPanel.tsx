import { useEffect } from 'react'

import { WorldWithPlugin } from '@core'

import { type TypedUseWorld, usePersistentState, useWorld } from '@core/react'

import type { RapierThreeVizPlugin } from '.'

const useThreeWorld: TypedUseWorld<WorldWithPlugin<RapierThreeVizPlugin>> = useWorld

export const RapierThreeVizPanel = () => {
    const world = useThreeWorld()

    const [viz, setViz] = usePersistentState<boolean>('R3-viz', false)
    const [depth, setDepth] = usePersistentState<boolean>('R3-depth', true)

    useEffect(() => {
        world.resources.rapierViz.api.toggleViz(viz)
    }, [world, viz])

    useEffect(() => {
        world.resources.rapierViz.api.toggleDepthTest(depth)
    }, [world, depth])

    const handleToggleViz = () => {
        setViz((prev) => !prev)
    }

    const handleToggleDepth = () => {
        setDepth((prev) => !prev)
    }

    return (
        <div>
            <h3>R3Viz</h3>
            <button onClick={handleToggleViz}>Toggle viz</button>
            <button onClick={handleToggleDepth}>Toggle depth test</button>
        </div>
    )
}
