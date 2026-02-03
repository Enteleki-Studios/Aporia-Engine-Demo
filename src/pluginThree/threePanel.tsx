import { type TypedUseWorld, useIntervalRender, useWorld } from '@core/react'

import { ThreeWorld } from '@pluginThree'

const useThreeWorld: TypedUseWorld<ThreeWorld> = useWorld

export const ThreePanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useIntervalRender(100)
    const world = useThreeWorld()

    return (
        <div>
            <h3>Three</h3>
            <pre>Calls: {world.three.renderer.renderer.info.render.calls}</pre>
            <pre>Tris: {world.three.renderer.renderer.info.render.triangles}</pre>
            <pre>Textures: {world.three.renderer.renderer.info.memory.textures}</pre>
            <pre>Geometries: {world.three.renderer.renderer.info.memory.geometries}</pre>
            <pre>Programs: {world.three.renderer.renderer.info.programs?.length}</pre>
        </div>
    )
}
