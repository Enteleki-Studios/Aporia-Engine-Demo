import { WorldWithPlugin } from '@core'
import { type TypedUseWorld, useWorld } from '@core/react'
import type { RapierThreeVizPlugin } from '.'
import { useCallback } from 'react'

const useThreeWorld: TypedUseWorld<WorldWithPlugin<RapierThreeVizPlugin>> = useWorld

export const RapierThreeVizPanel = () => {
    const world = useThreeWorld()

    const handleToggle = useCallback(() => {
        world.resources.rapierViz.toggleViz()
    }, [world])

    return (
        <div>
            <h3>R3Viz</h3>
            <button onClick={handleToggle}>Toggle viz</button>
        </div>
    )
}
