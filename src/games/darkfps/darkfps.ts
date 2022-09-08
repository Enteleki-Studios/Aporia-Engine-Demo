import { Action, Middleware } from '@reduxjs/toolkit'

import {
    AmbientLightComponent,
    CameraComponent,
    FirstPersonCameraSystem,
    World,
    inspector,
    InputComponent,
    DEFAULT_KEYMAP,
    InputManager,
    InputSystem,
    FirstPersonMovementSystem,
    CameraTargetComponent,
    PositionComponent,
    VelocityComponent,
    ApplyVelocitySystem,
} from 'gengine'

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

    const inputManager = new InputManager({
        domElement: canvas,
        keymap: DEFAULT_KEYMAP,
        pointerLock: true,
    })

    world.ecs.registerSystems([
        new InputSystem(inputManager),
        new FirstPersonMovementSystem(),
        new ApplyVelocitySystem(),
        new FirstPersonCameraSystem(),
        new RendererSystem(renderer),
    ])

    // Lighting
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new AmbientLightComponent({
            color: 0xffffff,
            intensity: 0.5,
        }),
    )

    // Camera
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new CameraComponent({ position: [10, 10, 10] }),
    )

    // Player
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new CameraTargetComponent(),
        new InputComponent(DEFAULT_KEYMAP),
        new PositionComponent(),
        new VelocityComponent(),
    )

    world.start()
}
