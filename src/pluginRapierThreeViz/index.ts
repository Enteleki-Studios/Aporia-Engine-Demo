import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three'

import type { Plugin, PluginsToResources } from '@core'

import type { PluginRapier3D } from '@pluginRapier3D'
import type { PluginThree } from '@pluginThree'

type Provides = {
    rapierViz: {
        lines: LineSegments
        toggleViz: () => void
    }
}

type Dependencies = PluginsToResources<[PluginThree, PluginRapier3D]>

export type RapierThreeVizPlugin = ReturnType<typeof pluginRapierThreeViz>

export const pluginRapierThreeViz = (): Plugin<Provides, Dependencies> => ({
    createResources() {
        const lines = new LineSegments(
            new BufferGeometry(),
            new LineBasicMaterial({
                color: 0xffffff,
                vertexColors: true,
            }),
        )

        // lines.material.depthTest = false
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
    init(world) {
        const { lines } = world.resources.rapierViz
        world.resources.three.renderer.scene.add(lines)

        world.addSystem(() => {
            const buffers = world.resources.physics.world.debugRender()
            lines.geometry.setAttribute(
                'position',
                new BufferAttribute(buffers.vertices, 3),
            )
            lines.geometry.setAttribute('color', new BufferAttribute(buffers.colors, 4))
        })
    },
})
