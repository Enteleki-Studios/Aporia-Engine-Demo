import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three'

import type { Plugin, PluginsToResources } from '@core'

import type { PluginRapier3D } from '@pluginRapier3D'
import type { PluginThree } from '@pluginThree'

type Provides = {
    rapierViz: {
        lines: LineSegments
        api: {
            toggleViz: (val?: boolean) => void
            toggleDepthTest: (val?: boolean) => void
        }
    }
}

type Dependencies = PluginsToResources<[PluginThree, PluginRapier3D]>

export { RapierThreeVizPanel } from './rapierThreeVizPanel'

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

        lines.renderOrder = 999
        lines.frustumCulled = false

        // Configurable:
        lines.visible = false
        lines.material.depthTest = true

        const toggleViz = (value?: boolean) => {
            lines.visible = value ?? !lines.visible
        }

        const toggleDepthTest = (value?: boolean) => {
            lines.material.depthTest = value ?? !lines.material.depthTest
        }

        return {
            rapierViz: {
                lines,
                api: {
                    toggleViz,
                    toggleDepthTest,
                },
            },
        }
    },
    init(world) {
        const { lines } = world.resources.rapierViz
        world.resources.three.renderer.scene.add(lines)

        // TODO: Try removing the system as the toggle instead of
        // using lines visibility
        world.addDebugSystem(() => {
            if (lines.visible) {
                const buffers = world.resources.physics.world.debugRender()
                lines.geometry.setAttribute(
                    'position',
                    new BufferAttribute(buffers.vertices, 3),
                )
                lines.geometry.setAttribute(
                    'color',
                    new BufferAttribute(buffers.colors, 4),
                )
            }
        })
    },
})
