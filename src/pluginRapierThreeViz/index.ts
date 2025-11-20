import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three'

import type { Plugin, PluginsToResources } from '@core'

import { pluginRapier3D } from '@pluginRapier3D'
import { pluginThree } from '@pluginThree'

type Provides = {
    rapierViz: {
        lines: LineSegments
        toggleViz: () => void
    }
}

type Dependencies = PluginsToResources<
    [ReturnType<typeof pluginThree>, ReturnType<typeof pluginRapier3D>]
>

export const pluginRapierThreeViz = (): Plugin<Provides, Dependencies> => ({
    createResources() {
        const lines = new LineSegments(
            new BufferGeometry(),
            new LineBasicMaterial({
                color: 0xffffff,
                vertexColors: true,
            }),
        )

        lines.material.depthTest = false
        lines.renderOrder = 999

        const toggleViz = (value?: boolean) => {
            lines.visible = value ?? !lines.visible
        }

        return {
            rapierViz: {
                lines,
                toggleViz,
            },
        }
    },
    init(runtime) {
        const { lines } = runtime.resources.rapierViz
        runtime.resources.three.renderer.scene.add(lines)

        runtime.addSystem((world) => {
            const buffers = world.resources.physics.world.debugRender()
            lines.geometry.setAttribute(
                'position',
                new BufferAttribute(buffers.vertices, 3),
            )
            lines.geometry.setAttribute('color', new BufferAttribute(buffers.colors, 4))
        })
    },
})
