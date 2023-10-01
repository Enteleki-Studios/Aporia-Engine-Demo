import { Action, Middleware } from '@reduxjs/toolkit'
import {
    AmbientLightComponent,
    BasicGeometryComponent,
    HealthComponent,
    // DirectionalLightComponent,
    HeroComponent,
    InputManager,
    ModelComponent,
    DEFAULT_KEYMAP,
    inputSystem,
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
    applyVelocitySystem,
    // DamageSystem,
    DamagingComponent,
    PointLightComponent,
    inspector,
    firstPersonCameraSystem,
    DirectionComponent,
    firstPersonMovementSystem,
    EmitterComponent,
    // EmitterSystem,
    ColliderComponent,
    AIComponent,
    Entity,
    movingEntitiesFilter,
    modelFilter,
    directionalLightFilter,
    ambientLightFilter,
    cameraFilter,
    pointLightFilter,
    boxFilter,
    rotatingEntitiesFilter,
    collidingFilter,
    cameraTargetFilter,
    inputFilter,
    firstPersonMovementFilter,
    heroFilter,
    Octree,
    tags,
} from 'gengine'

// import { AppDispatch } from 'dungeon/store'

import * as Systems from 'systems'
import * as Components from 'components'
import { Renderer } from 'Renderer'
// import tilesGenerator from 'utils/tilesGenerator'

import modelDB from 'modelDB'

export const world = new World()

const octree = new Octree()

const renderer = new Renderer({})
export const updateCanvasContainer = (container: HTMLDivElement) => {
    renderer.setCanvasContainer(container)
}

const inputManager = new InputManager({
    domElement: renderer.canvas,
    keymap: DEFAULT_KEYMAP,
    pointerLock: true,
})

inputManager.addActionListener('debug', () => {
    const { debugMode } = renderer
    if (debugMode === 'game') {
        renderer.setDebugMode('debug')
        inputManager.disablePointerLock()
    } else {
        renderer.setDebugMode('game')
        inputManager.allowPointerLock()
    }
})

world.ecs.registerFilters([
    movingEntitiesFilter,
    modelFilter,
    directionalLightFilter,
    inputFilter,
    ambientLightFilter,
    cameraFilter,
    cameraTargetFilter,
    pointLightFilter,
    boxFilter,
    rotatingEntitiesFilter,
    collidingFilter,
    firstPersonMovementFilter,
    heroFilter,
    Systems.aiSystemFilter,
    Systems.collisionsFilter,
])

world.ecs.registerSystems([
    inputSystem({ inputManager }),
    // new EmitterSystem({
    //     ball: () =>
    //         new Entity().addComponents(
    //             new BasicGeometryComponent({
    //                 geometryType: 'sphere',
    //                 radius: 0.25,
    //                 color: 0xff0099,
    //             }),
    //             new PositionComponent(),
    //             new VelocityComponent({ velocity: [-2, 0, 0] }),
    //         ),
    // }),
    // new TwinStickMovementSystem(),
    firstPersonMovementSystem(),
    Systems.aiSystem(),
    Systems.collisionSystem({ octree }),
    applyVelocitySystem(),
    // new DamageSystem(),
    // new ThirdPersonCameraSystem(),
    firstPersonCameraSystem(),
    // new SunSystem(),
    // new Systems.AnimationSystem(),
    new Systems.RendererSystem(renderer, octree),
])

export const middleware: Middleware = () => (next) => (action: Action) => {
    if (inspector.slice.actions.setDebugMode.match(action)) {
        renderer.setDebugMode(action.payload)
    }

    return next(action)
}

// Lighting
world.ecs.registerEntity(
    new Entity().addComponents(
        new AmbientLightComponent({
            color: 0xf4e99b,
            intensity: 0.05,
        }),
        new PointLightComponent({
            color: 0xf4e99b,
            intensity: 3,
            offset: [0, 2, 0],
            castShadow: true,
        }),
    ),
)

// Sun
// world.ecs.createEntity().addComponents(
//     new DirectionalLightComponent([5, 15, 5], 0.5),
// )

// Test stuff
world.ecs.registerEntity(
    new Entity().addComponents(
        new BasicGeometryComponent({ geometryType: 'box' }),
        new PositionComponent({ position: [0, 1, 5] }),
        new EmitterComponent('ball'),
    ),
)

// Camera
world.ecs.registerEntity(new Entity().addComponents(new CameraComponent()))

// Player
world.ecs.registerEntity(
    new Entity().addComponents(
        new Components.AnimationComponent('idle'),
        new Components.CollidableComponent(),
        new CameraTargetComponent(),
        new DirectionComponent(),
        new SunTargetComponent(),
        new HitboxComponent(modelDB.wizard.radius),
        new HealthComponent(20),
        new InputComponent(DEFAULT_KEYMAP),
        // new ModelComponent<typeof modelDB>({ modelName: 'wizard' }),
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
            color: 0xffeeff,
            intensity: 3,
            offset: [0, 2, 0],
            castShadow: true,
        }),
    ).tag(tags.hero),
)

// Shibs
world.ecs.registerEntity(
    new Entity().addComponents(
        new Components.AnimationComponent('idle'),
        new ModelComponent({ modelName: 'shiba', castShadow: true }),
        new PositionComponent({ position: [1, 0, 2] }),
        new HealthComponent(20),
        new VelocityComponent(),
        new AIComponent(),
        new DirectionComponent(),
        // new HitboxComponent(0.25),
    ),
)

// // Slime
// world.ecs.createEntity().addComponents(
//     new Components.AnimationComponent('idle'),
//     new ModelComponent({ modelName: 'slime' }),
//     new PositionComponent({ position: [4, 0, 2] }),
//     new HealthComponent(20),
//     new HitboxComponent(0.25),
// )

// Items
const items = ['barrel', 'column', 'entrance', 'rock_1', 'cart']
items.forEach((item, i) => {
    world.ecs.registerEntity(
        new Entity().addComponents(
            new ModelComponent({ modelName: item, castShadow: true }),
            new PositionComponent({ position: [i * 3 - 12, 0, 8] }),
            new ColliderComponent({
                type: 'cylinder',
                radius: modelDB[item].radius ?? 1,
                height: 2,
                resolution: 10,
            }),
        ),
    )
})

// Crate
world.ecs.registerEntity(
    new Entity().addComponents(
        new ModelComponent({ modelName: 'crate' }),
        new PositionComponent({ position: [5, 0, 5] }),
        new ColliderComponent({
            type: 'box',
            width: 0.75,
            height: 0.75,
            depth: 0.75,
        }),
    ),
)

// Wall torches
const torches = [9.75, 3.25, -3.25]
torches.forEach((posZ) => {
    world.ecs.registerEntity(
        new Entity().addComponents(
            new ModelComponent({ modelName: 'torchWall' }),
            new PositionComponent({ position: [-16, 1.5, posZ] }),
            new PointLightComponent({
                color: 0xff6700,
                intensity: 3,
                offset: [0.75, 0.5, 0],
            }),
        ),
    )
})

// Gold chest
world.ecs.registerEntity(
    new Entity().addComponents(
        new ModelComponent({ modelName: 'chest_gold' }),
        new PositionComponent({ position: [-6, 0, -6] }),
        new PointLightComponent({
            color: 0xffd700,
            intensity: 1,
            offset: [0.5, 0.7, 0],
        }),
        new ColliderComponent({ type: 'box', width: 1, height: 1, depth: 1 }),
    ),
)

// Walls
for (let i = 0; i < 32; i += 2) {
    world.ecs.registerEntity(
        new Entity().addComponents(
            new ModelComponent({ modelName: 'stoneWallTop' }),
            new PositionComponent({ position: [-16, 0, i - 15] }),
            new ColliderComponent({ type: 'box', width: 0.25, height: 2, depth: 2 }),
        ),
    )
}

// Grass
const makePos = (): [number, number, number] => [Math.random() * 30 - 15, 0, Math.random() * 30 - 15]
for (let i = 0; i < 200; i += 1) {
    world.ecs.registerEntity(
        new Entity().addComponents(
            new ModelComponent({ modelName: 'grass' }),
            new PositionComponent({ position: makePos() }),
        ),
    )
}

export const init = () => {
    world.start()
}

// store.dispatch({ type: 'TEST' })

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
