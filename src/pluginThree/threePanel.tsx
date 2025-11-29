import { type TypedUseWorld, useRenderSync, useWorld } from '@core/react'

import { ThreeWorld } from '@pluginThree'

const useThreeWorld: TypedUseWorld<ThreeWorld> = useWorld

export const ThreePanel = () => {
    // TODO: use observers in the entities class instead of
    // refreshing every frame
    useRenderSync()
    const world = useThreeWorld()

    return (
        <div>
            <h3>Three</h3>
            <pre>Calls: {world.resources.three.renderer.renderer.info.render.calls}</pre>
            <pre>
                Tris: {world.resources.three.renderer.renderer.info.render.triangles}
            </pre>
            <pre>
                Textures: {world.resources.three.renderer.renderer.info.memory.textures}
            </pre>
            <pre>
                Geometries:{' '}
                {world.resources.three.renderer.renderer.info.memory.geometries}
            </pre>
        </div>
    )
}
