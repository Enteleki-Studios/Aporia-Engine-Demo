import { store } from 'dungeon/store'

import {
    AmbientLightComponent,
    BasicGeometryComponent,
    HealthComponent,
    // DirectionalLightComponent,
    HeroComponent,
    InputManager,
    ModelComponent,
    DEFAULT_KEYMAP,
    InputSystem,
    InputComponent,
    PositionComponent,
    HitboxComponent,
    // ThirdPersonCameraSystem,
    CameraComponent,
    CameraTargetComponent,
    VelocityComponent,
    SunTargetComponent,
    // SunSystem,
    World,
    // TwinStickMovementSystem,
    ApplyVelocitySystem,
    DamageSystem,
    DamagingComponent,
    PointLightComponent,
    inspector,
    FirstPersonCameraSystem,
    DirectionComponent,
    FirstPersonMovementSystem,
} from 'gengine'

// import { AppDispatch } from 'dungeon/store'

import * as Systems from 'dungeon/systems'
import * as Components from 'dungeon/components'
import { Renderer } from 'dungeon/Renderer'
// import tilesGenerator from 'utils/tilesGenerator'

import modelDB from 'modelDB'
import { Action, Middleware } from '@reduxjs/toolkit'

export const renderer = new Renderer({})

const loggingFunction = inspector.logger(store)

export const world = new World({
    loggingEnabled: true,
    loggingFunction,
})

export const middleware: Middleware = () => (next) => (action: Action) => {
    if (inspector.slice.actions.setDebugMode.match(action)) {
        renderer.setDebugMode(action.payload)
    }

    return next(action)
}

export const init = () => {
    const inputManager = new InputManager({
        domElement: renderer.canvas,
        keymap: DEFAULT_KEYMAP,
        pointerLock: true,
    })
    inputManager.addActionListener('debug', () => {
        const { debugMode } = renderer
        if (debugMode === 'game') {
            renderer.setDebugMode('debug')
        } else {
            renderer.setDebugMode('game')
        }
    })

    world.ecs.registerSystems([
        new InputSystem(inputManager),
        // new TwinStickMovementSystem(),
        new FirstPersonMovementSystem(),
        new Systems.CollisionSystem(),
        new ApplyVelocitySystem(),
        new DamageSystem(),
        // new ThirdPersonCameraSystem(),
        new FirstPersonCameraSystem(),
        // new SunSystem(),
        new Systems.AnimationSystem(),
        new Systems.RendererSystem(renderer),
    ])

    // Lighting
    world.ecs.createEntity().addComponents(
        new AmbientLightComponent({
            color: 0xaaaaff,
            intensity: 0.05,
        }),
    )

    // Sun
    // world.ecs.createEntity().addComponents(
    //     new DirectionalLightComponent([5, 15, 5], 0.5),
    // )

    world.ecs.createEntity().addComponents(
        new PositionComponent({ position: [0, 2, 0] }),
        new PointLightComponent({
            color: 0xffee88,
            intensity: 3,
        }),
    )

    // Camera
    world.ecs.createEntity().addComponents(
        new CameraComponent(),
    )

    // Player
    world.ecs.createEntity().addComponents(
        new Components.AnimationComponent('idle'),
        new Components.CollidableComponent(),
        new CameraTargetComponent(),
        new DirectionComponent(),
        new SunTargetComponent(),
        new HitboxComponent(modelDB.wizard.radius),
        new HealthComponent(20),
        new HeroComponent(),
        new InputComponent(DEFAULT_KEYMAP),
        new ModelComponent<typeof modelDB>({ modelName: 'wizard' }),
        new PositionComponent({ position: [0, 0, -1] }),
        new VelocityComponent(),
        new DamagingComponent({
            radius: 1,
            theta: 2,
            spoolUp: 0.25,
            coolDown: 0.5,
            damage: 5,
        }),
        new PointLightComponent({
            color: 0xffee88,
            intensity: 3,
            offset: [0, 2, 2],
            castShadow: true,
        }),
    )

    // Skeleton
    world.ecs.createEntity().addComponents(
        new Components.AnimationComponent('idle'),
        new ModelComponent({ modelName: 'skeleton' }),
        new PositionComponent({ position: [1, 0, 2] }),
        new HealthComponent(20),
        new HitboxComponent(0.25),
    )

    // Slime
    world.ecs.createEntity().addComponents(
        new Components.AnimationComponent('idle'),
        new ModelComponent({ modelName: 'slime' }),
        new PositionComponent({ position: [4, 0, 2] }),
        new HealthComponent(20),
        new HitboxComponent(0.25),
    )

    // Items
    const items = ['barrel', 'column', 'entrance', 'rock_1', 'cart', 'crate']
    items.forEach((item, i) => {
        world.ecs.createEntity().addComponents(
            new ModelComponent({ modelName: item }),
            new PositionComponent({ position: [i * 3 - 12, 0, 8] }),
            new HitboxComponent(modelDB[item].radius),
        )
    })

    // Wall torches
    const torches = [9.75, 3.25, -3.25]
    torches.forEach((posZ) => {
        world.ecs.createEntity().addComponents(
            new ModelComponent({ modelName: 'torchWall' }),
            new PositionComponent({ position: [-16, 1.5, posZ] }),
            new PointLightComponent({
                color: 0xff6700,
                intensity: 3,
                offset: [0.75, 0.5, 0],
            }),
        )
    })

    // Gold chest
    world.ecs.createEntity().addComponents(
        new ModelComponent({ modelName: 'chest_gold' }),
        new PositionComponent({ position: [-6, 0, -6] }),
        new PointLightComponent({
            color: 0xffD700,
            intensity: 1,
            offset: [0.5, 0.7, 0],
        }),
    )

    for (let i = 0; i < 32; i += 2) {
        world.ecs.createEntity().addComponents(
            new ModelComponent({ modelName: 'stoneWallTop' }),
            new PositionComponent({ position: [-16, 0, i - 15] }),
            new HitboxComponent(modelDB.stoneWall.radius),
        )
    }

    // Grass
    const makePos: () => [number, number, number] = () => ([
        Math.random() * 30 - 15,
        0,
        Math.random() * 30 - 15,
    ])
    for (let i = 0; i < 200; i += 1) {
        world.ecs.createEntity().addComponents(
            new ModelComponent({ modelName: 'grass' }),
            new PositionComponent({ position: makePos() }),
        )
    }

    // Test geomestry
    const testBox = world.ecs.createEntity()
    testBox.addComponents(
        new BasicGeometryComponent('box'),
        new PositionComponent({ position: [0, 0, 5] }),
    )

    world.start()

    // store.dispatch({ type: 'TEST' })
}

// const slimeEntity = createEntity()
// DungeonECS.addComponents([
//     new AnimationComponent(slimeEntity, 'idle'),
//     new InputComponent(slimeEntity),
//     new CollisionComponent(slimeEntity),
//     new HealthComponent(slimeEntity, { health: 20 }),
//     new ModelComponent(slimeEntity, { modelId: 2 }),
//     new PositionComponent(slimeEntity, new THREE.Vector3(64, 0, 66)),
// ])

// const batEntity = createEntity()
// DungeonECS.addComponents([
//     new AnimationComponent(batEntity, 'idle'),
//     new InputComponent(batEntity),
//     new CollisionComponent(batEntity),
//     new ModelComponent(batEntity, { modelId: 3 }),
//     new PositionComponent(batEntity, new THREE.Vector3(60, 1, 66)),
// ])

// const sprigEntity = createEntity()
// DungeonECS.addComponents([
//     new ModelComponent(sprigEntity, { modelId: 5 }),
//     new PositionComponent(sprigEntity, new THREE.Vector3(62, 0, 64)),
// ])
