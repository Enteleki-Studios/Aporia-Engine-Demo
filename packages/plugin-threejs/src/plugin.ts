import { Octree } from 'three/examples/jsm/math/Octree'
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper'

import { createPlugin, World } from '@gengine/core'
import {
    directionalLightFilter,
    cameraFilter,
    movingEntitiesFilter,
    rotatingEntitiesFilter,
    modelFilter,
    ambientLightFilter,
    boxFilter,
    collidingFilter,
    mesh2DFilter,
    positionedEntitiesFilter,
} from '@gengine/core'

import { Renderer } from './Renderer'
import { makeObject3dManager, makeAnimationManager } from './object3dManager'
import { entityReceiver } from './entityReceiver'
import { rendererSystem } from './systems'

export const threejsPlugin = createPlugin('Three.js plugin', () => {
    const renderer = new Renderer({})
    const objectManager = makeObject3dManager(renderer)
    const animationManager = makeAnimationManager()
    const octree = new Octree()

    const octreeHelper = new OctreeHelper(octree, '#0089cc')
    renderer.scene.add(octreeHelper)
    renderer.registerHelper(octreeHelper)

    const threeEntityReceiver = entityReceiver({ renderer, objectManager, octree, octreeHelper, animationManager })

    return {
        init(world: World) {
            world.registerSystem(rendererSystem({ renderer, objectManager }))

            // TODO remove need to register filters
            world.ecs.registerFilters([
                directionalLightFilter,
                cameraFilter,
                movingEntitiesFilter,
                rotatingEntitiesFilter,
                positionedEntitiesFilter,
            ])

            // TODO: Very temporary
            world.ecs.addFilterListener(modelFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(ambientLightFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(boxFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(collidingFilter, (e, f) => threeEntityReceiver(e, f))
            world.ecs.addFilterListener(mesh2DFilter, (e, f) => threeEntityReceiver(e, f))
        },
        resources: {
            octree,
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
