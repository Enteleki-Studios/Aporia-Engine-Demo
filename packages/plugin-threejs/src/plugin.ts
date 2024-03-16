import { createPlugin, World } from '@gengine/core'
import { modelFilter, ambientLightFilter, boxFilter, collidingFilter, mesh2DFilter } from '@gengine/core'

import { Renderer } from './Renderer'
import { makeObject3dManager, makeAnimationManager } from './object3dManager'
import { entityReceiver } from './entityReceiver'
import { syncThreeSystem, renderSystem } from './systems'

export const threejsPlugin = createPlugin('Three.js plugin', () => {
    const renderer = new Renderer()
    const objectManager = makeObject3dManager(renderer)
    const animationManager = makeAnimationManager()

    const threeEntityReceiver = entityReceiver({ renderer, objectManager, animationManager })

    return {
        init(world: World) {
            world.registerSystem(renderSystem({ renderer }), 0)
            world.registerSystem(syncThreeSystem({ renderer, objectManager }))

            // TODO: Very temporary
            world.ecs.addFilterListener(modelFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(ambientLightFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(boxFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(collidingFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(mesh2DFilter, (e, f) => threeEntityReceiver(e, f))
        },
        resources: {
            renderer,
            objectManager,
            animationManager,
        },
        api: {
            setCanvasContainer(container: HTMLDivElement) {
                renderer.setCanvasContainer(container)
            },
        },
    }
})
