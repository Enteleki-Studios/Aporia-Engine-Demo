import { Action, Middleware } from '@reduxjs/toolkit'

import { World, CameraComponent, AmbientLightComponent, inspector } from 'gengine'

import { Renderer } from './Renderer'
import { RendererSystem } from './RendererSystem'

let renderer: Renderer

export const world = new World()

export const middleware: Middleware = () => (next) => (action: Action) => {
    if (inspector.slice.actions.setDebugMode.match(action)) {
        renderer.setDebugMode(action.payload)
    }

    return next(action)
}

export const init = (canvas: HTMLCanvasElement) => {
    renderer = new Renderer({ canvas })

    world.ecs.registerSystems([
        new RendererSystem(renderer),
    ])

    // Lighting
    world.ecs.createEntity().addComponents(
        new AmbientLightComponent({
            color: 0xffffff,
            intensity: 0.5,
        }),
    )

    // Camera
    world.ecs.createEntity().addComponents(
        new CameraComponent({ position: [10, 10, 10] }),
    )

    world.start()
}
