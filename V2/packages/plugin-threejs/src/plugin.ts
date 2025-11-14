import type { Plugin, World } from '@gengine/core'
import {
    ambientLightFilter,
    boxFilter,
    collidingFilter,
    mesh2DFilter,
    modelFilter,
} from '@gengine/core'

import { Renderer } from './Renderer'
import { entityReceiver } from './entityReceiver'
import { makeAnimationManager, makeObject3dManager } from './object3dManager'
import { renderSystem, syncThreeSystem } from './systems'

export class ThreejsPlugin implements Plugin {
    name = 'ThreejsPlugin'

    private threeEntityReceiver: ReturnType<typeof entityReceiver>

    renderer: Renderer
    objectManager: ReturnType<typeof makeObject3dManager>
    animationManager: ReturnType<typeof makeAnimationManager>

    constructor() {
        this.renderer = new Renderer()
        this.objectManager = makeObject3dManager(this.renderer)
        this.animationManager = makeAnimationManager()

        this.threeEntityReceiver = entityReceiver({
            renderer: this.renderer,
            objectManager: this.objectManager,
            animationManager: this.animationManager,
        })
    }

    init(world: World) {
        world.registerSystem(renderSystem({ renderer: this.renderer }), 0)
        world.registerSystem(
            syncThreeSystem({
                renderer: this.renderer,
                objectManager: this.objectManager,
            }),
        )

        // TODO: Very temporary
        world.ecs.addFilterListener(modelFilter, (e, f) => this.threeEntityReceiver(e, f))
        world.ecs.addFilterListener(ambientLightFilter, (e, f) =>
            this.threeEntityReceiver(e, f),
        )
        world.ecs.addFilterListener(boxFilter, (e, f) => this.threeEntityReceiver(e, f))
        world.ecs.addFilterListener(collidingFilter, (e, f) =>
            this.threeEntityReceiver(e, f),
        )
        world.ecs.addFilterListener(mesh2DFilter, (e, f) =>
            this.threeEntityReceiver(e, f),
        )
    }
}
