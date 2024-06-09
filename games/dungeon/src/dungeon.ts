import { Middleware } from '@reduxjs/toolkit'

import {
    DEFAULT_KEYMAP,
    Entity,
    InputManager,
    World,
    ambientLightComponent,
    animationComponent,
    basicGeometryComponent,
    cameraComponent,
    characterController,
    collider3D,
    colliderComponent,
    damageSystem,
    damagingComponent,
    directionComponent,
    emitterComponent,
    emitterSystem,
    healthComponent,
    hitboxComponent,
    inputComponent,
    inputSystem,
    material,
    mesh2D,
    modelComponent,
    pointLightComponent,
    rigidBody3D,
    tags,
    thirdPersonCameraSystem,
    transform3D,
    twinStickMovementSystem,
    velocityComponent,
} from '@gengine/core'
import { Rapier3DPlugin } from '@gengine/plugin-rapier3D'
import { ThreejsPlugin } from '@gengine/plugin-threejs'

// import { AppDispatch } from 'dungeon/store'
import * as Systems from '~/systems'

// import * as Components from 'components'
// import tilesGenerator from 'utils/tilesGenerator'
import modelDB from './modelDB'

export const world = new World()

const threejs = new ThreejsPlugin()
const { renderer } = threejs

const inputManager = new InputManager({
    domElement: renderer.canvas,
    keymap: DEFAULT_KEYMAP,
    // pointerLock: true,
    pointerLock: false,
})

// world.frameSync = false

world
    .registerSystem(inputSystem({ inputManager }))
    .registerSystems([twinStickMovementSystem(), Systems.aiSystem()])
    .registerPlugin(new Rapier3DPlugin())
    .registerSystems([
        emitterSystem({
            prefabs: {
                ball: () =>
                    Entity.of(
                        basicGeometryComponent({
                            geometryType: 'sphere',
                            radius: 0.25,
                            color: 0xff0099,
                        }),
                        transform3D({}),
                        rigidBody3D({
                            velocity: [-6, 0, Math.random() - 0.5],
                            mass: 0.1,
                        }),
                        collider3D({
                            shape: {
                                type: 'sphere',
                                radius: 0.25,
                            },
                        }),
                    ),
            },
        }),
        damageSystem(),
        thirdPersonCameraSystem(),
        Systems.animationSystem(),
    ])
    .registerPlugin(threejs)

export const middleware: Middleware = () => (next) => (action: unknown) => {
    // if (inspectorSlice.actions.setDebugMode.match(action)) {
    //     renderer.setDebugMode(action.payload)
    // }

    return next(action)
}

// Lighting
world.entities.addEntity(
    Entity.of(
        { name: 'lighting' },
        ambientLightComponent({
            color: 0xf4e99b,
            intensity: 0.2,
        }),
        pointLightComponent({
            color: 0xf4e99b,
            intensity: 3,
            offset: [0, 2, 0],
            castShadow: true,
        }),
    ),
)

// Floor
world.entities.addEntity(
    Entity.of(
        { name: 'floor' },
        mesh2D({ shape: 'plane', width: 32, height: 32 }),
        transform3D({
            rotation: [-Math.PI / 2, 0, 0],
        }),
        material({
            material: 'standard',
            mapUrl: '/resources/textures/floor.jpg',
            wrapS: true,
            wrapT: true,
            repeatX: 32,
            repeatY: 32,
        }),
        rigidBody3D({}),
        collider3D({ shape: { type: 'box', size: [32, 0.01, 32] } }),
    ),
)

// Test box
world.entities.addEntity(
    Entity.of(
        { name: 'test box' },
        basicGeometryComponent({ geometryType: 'box' }),
        transform3D({ position: [0, 1, 5] }),
        emitterComponent({ prefabId: 'ball', delay: 2 }),
    ),
)

world.entities.addEntity(
    Entity.of(
        { name: 'test step' },
        basicGeometryComponent({ geometryType: 'box', color: 0xff0000 }),
        transform3D({ position: [0, -0.25, 0] }),
        rigidBody3D({}),
        collider3D({
            shape: {
                type: 'box',
                size: [1, 1, 1],
            },
        }),
    ),
)

// Camera
world.entities.addEntity(Entity.of({ name: 'camera' }, cameraComponent({})))

// Player
world.entities.addEntity(
    Entity.of(
        { name: 'hero' },
        animationComponent({ state: 'idle' }),
        directionComponent({}),
        hitboxComponent({ radius: 1 }),
        healthComponent({ health: 20 }),
        inputComponent({ keymap: DEFAULT_KEYMAP }),
        modelComponent({ modelName: 'wizard', data: modelDB['wizard'], castShadow: true }),
        transform3D({ position: [0, 2, -1] }),
        velocityComponent({}),
        damagingComponent({
            radius: 1,
            theta: 2,
            spoolUp: 0.25,
            coolDown: 0.5,
            damage: 5,
        }),
        characterController({}),
        rigidBody3D({
            mass: 80,
        }),
        collider3D({
            shape: {
                type: 'capsule',
                height: 2,
                radius: 0.5,
            },
        }),
        // pointLightComponent({
        //     color: 0xffeeff,
        //     intensity: 3,
        //     offset: [0, 2, 0],
        //     castShadow: true,
        // }),
    ).tag(tags.hero, tags.cameraTarget, tags.sunTarget),
)

// Shibs
world.entities.addEntity(
    Entity.of(
        { name: 'dog' },
        animationComponent({ state: 'idle' }),
        modelComponent({ modelName: 'shiba', castShadow: true, data: modelDB['shiba'] }),
        transform3D({ position: [1, 0.5, 2] }),
        healthComponent({ health: 20 }),
        directionComponent({}),
        velocityComponent({}),
        hitboxComponent({ radius: 0.25 }),
        characterController({}),
        rigidBody3D({
            mass: 40,
        }),
        collider3D({
            shape: {
                type: 'cylinder',
                radius: 0.5,
                height: 0.5,
            },
        }),
    ).tag(tags.ai),
)

// Items
const items = ['barrel', 'column', 'entrance', 'rock_1', 'cart']
items.forEach((item, i) => {
    world.entities.addEntity(
        Entity.of(
            { name: item },
            modelComponent({ modelName: item, castShadow: true, data: modelDB[item] }),
            transform3D({ position: [i * 3 - 12, 0, 8] }),
            colliderComponent({
                collider: {
                    type: 'cylinder',
                    radius: modelDB[item].radius ?? 1,
                    height: 2,
                    resolution: 10,
                },
            }),
        ),
    )
})

// Stairs
world.entities.addEntity(
    Entity.of(
        { name: 'stairs' },
        modelComponent({ modelName: 'stairs', data: modelDB['stairs'] }),
        transform3D({ position: [0, 0, -5] }),
        rigidBody3D({}),
        collider3D({
            shape: {
                type: 'box',
                size: [1, 0.25, 1],
            },
        }),
    ),
)

// Upper floor
world.entities.addEntity(
    Entity.of(
        { name: 'upper level' },
        modelComponent({ modelName: 'floor', data: modelDB['floor'] }),
        transform3D({ position: [-1.5, 0.5, -5] }),
        rigidBody3D({}),
        collider3D({
            shape: {
                type: 'box',
                size: [1, 0.5, 1],
            },
        }),
    ),
)
world.entities.addEntity(
    Entity.of(
        { name: 'upper level 2' },
        modelComponent({ modelName: 'floor', data: modelDB['floor'] }),
        transform3D({ position: [-3.5, 0.5, -5] }),
        rigidBody3D({}),
        collider3D({
            shape: {
                type: 'box',
                size: [1, 0.5, 1],
            },
        }),
    ),
)

// Crate
world.entities.addEntity(
    Entity.of(
        { name: 'crate' },
        modelComponent({ modelName: 'crate', data: modelDB['crate'] }),
        transform3D({ position: [5, 0, 5] }),
        colliderComponent({
            collider: {
                type: 'box',
                width: 0.75,
                height: 0.75,
                depth: 0.75,
            },
        }),
    ),
)

// Wall torches
const torches = [9.75, 3.25, -3.25]
torches.forEach((posZ, i) => {
    world.entities.addEntity(
        Entity.of(
            { name: `torch (${i})` },
            modelComponent({ modelName: 'torchWall', data: modelDB['torchWall'] }),
            transform3D({ position: [-16, 1.5, posZ] }),
            pointLightComponent({
                color: 0xff6700,
                intensity: 3,
                offset: [0.75, 0.5, 0],
            }),
        ),
    )
})

// Gold chest
world.entities.addEntity(
    Entity.of(
        { name: 'chest' },
        modelComponent({ modelName: 'chest_gold', data: modelDB['chest_gold'] }),
        transform3D({ position: [-6, 0, -6] }),
        pointLightComponent({
            color: 0xffd700,
            intensity: 1,
            offset: [0.5, 0.7, 0],
        }),
        colliderComponent({ collider: { type: 'box', width: 1, height: 1, depth: 1 } }),
    ),
)

// Walls
for (let i = 0; i < 32; i += 2) {
    world.entities.addEntity(
        Entity.of(
            { name: `wall (${i})` },
            modelComponent({ modelName: 'stoneWallTop', data: modelDB['stoneWallTop'] }),
            transform3D({ position: [-16, 1, i - 15] }),
            rigidBody3D({}),
            collider3D({
                shape: {
                    type: 'box',
                    size: [0.25, 2, 2],
                },
            }),
        ),
    )
}

// Grass
const makePos = (): [number, number, number] => [Math.random() * 30 - 15, 0, Math.random() * 30 - 15]
for (let i = 0; i < 200; i += 1) {
    world.entities.addEntity(
        Entity.of(modelComponent({ modelName: 'grass', data: modelDB['grass'] }), transform3D({ position: makePos() })),
    )
}

export const init = () => {
    world.start()
}
