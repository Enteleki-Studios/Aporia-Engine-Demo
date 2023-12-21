import { Middleware } from '@reduxjs/toolkit'
import {
    ambientLightComponent,
    basicGeometryComponent,
    healthComponent,
    // DirectionalLightComponent,
    InputManager,
    modelComponent,
    DEFAULT_KEYMAP,
    inputSystem,
    inputComponent,
    positionComponent,
    hitboxComponent,
    thirdPersonCameraSystem,
    cameraComponent,
    velocityComponent,
    // SunSystem,
    World,
    twinStickMovementSystem,
    applyVelocitySystem,
    damageSystem,
    damagingComponent,
    damagableFilter,
    damagingFilter,
    pointLightComponent,
    inspector,
    // firstPersonCameraSystem,
    directionComponent,
    // firstPersonMovementSystem,
    emitterComponent,
    emitterSystem,
    emitterFilter,
    colliderComponent,
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
    // firstPersonMovementFilter,
    twinStickMovementFilter,
    heroFilter,
    tags,
    mesh2D,
    mesh2DFilter,
    material,
    transform3D,
    threejsPlugin,
    animationComponent,
} from 'gengine'

// import { AppDispatch } from 'dungeon/store'

import * as Systems from 'systems'
// import * as Components from 'components'
// import tilesGenerator from 'utils/tilesGenerator'

import modelDB from 'modelDB'

export const world = new World()
world.getPlugin(threejsPlugin)

const threejs = threejsPlugin()
const { renderer, octree } = threejs.resources

export const updateCanvasContainer = (container: HTMLDivElement) => {
    world.getPlugin(threejsPlugin).setCanvasContainer(container)
}

const inputManager = new InputManager({
    domElement: renderer.canvas,
    keymap: DEFAULT_KEYMAP,
    // pointerLock: true,
    pointerLock: false,
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
    // firstPersonMovementFilter,
    twinStickMovementFilter,
    heroFilter,
    Systems.aiSystemFilter,
    Systems.collisionsFilter,
    emitterFilter,
    damagingFilter,
    damagableFilter,
    Systems.animatedFilter,
    mesh2DFilter,
])

world
    .registerPlugin(threejs)
    .registerSystems([
        inputSystem({ inputManager }),
        emitterSystem({
            prefabs: {
                ball: () =>
                    new Entity().addComponents(
                        basicGeometryComponent({
                            geometryType: 'sphere',
                            radius: 0.25,
                            color: 0xff0099,
                        }),
                        positionComponent({}),
                        velocityComponent({ velocity: [-2, 0, 0] }),
                    ),
            },
        }),
        twinStickMovementSystem(),
        // firstPersonMovementSystem(),
        Systems.aiSystem(),
        Systems.collisionSystem({ octree }),
        applyVelocitySystem(),
        damageSystem(),
        thirdPersonCameraSystem(),
        // firstPersonCameraSystem(),
        // sunSystem(),
        Systems.animationSystem({ animationManager: threejs.resources.animationManager }),
    ])

export const middleware: Middleware = () => (next) => (action: unknown) => {
    if (inspector.slice.actions.setDebugMode.match(action)) {
        renderer.setDebugMode(action.payload)
    }

    return next(action)
}

// Lighting
world.ecs.registerEntity(
    new Entity().addComponents(
        ambientLightComponent({
            color: 0xf4e99b,
            intensity: 0.05,
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
world.ecs.registerEntity(
    new Entity().addComponents(
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
    ),
)

// Sun
// world.ecs.createEntity().addComponents(
//     new DirectionalLightComponent([5, 15, 5], 0.5),
// )

// Test stuff
world.ecs.registerEntity(
    new Entity().addComponents(
        basicGeometryComponent({ geometryType: 'box' }),
        positionComponent({ position: [0, 1, 5] }),
        emitterComponent({ prefabId: 'ball', delay: 2 }),
    ),
)

// Camera
world.ecs.registerEntity(new Entity().addComponents(cameraComponent({})))

// Player
world.ecs.registerEntity(
    new Entity()
        .addComponents(
            animationComponent({ state: 'idle' }),
            // new Components.CollidableComponent(),
            directionComponent({}),
            hitboxComponent({ radius: 1 }),
            healthComponent({ health: 20 }),
            inputComponent({ keymap: DEFAULT_KEYMAP }),
            modelComponent({ modelName: 'wizard', data: modelDB['wizard'] }),
            positionComponent({ position: [0, 0, -1] }),
            velocityComponent({}),
            damagingComponent({
                radius: 1,
                theta: 2,
                spoolUp: 0.25,
                coolDown: 0.5,
                damage: 5,
            }),
            // pointLightComponent({
            //     color: 0xffeeff,
            //     intensity: 3,
            //     offset: [0, 2, 0],
            //     castShadow: true,
            // }),
        )
        .tag(tags.hero, tags.cameraTarget, tags.sunTarget),
)

// Shibs
world.ecs.registerEntity(
    new Entity()
        .addComponents(
            animationComponent({ state: 'idle' }),
            modelComponent({ modelName: 'shiba', castShadow: true, data: modelDB['shiba'] }),
            positionComponent({ position: [1, 0, 2] }),
            healthComponent({ health: 20 }),
            directionComponent({}),
            velocityComponent({}),
            hitboxComponent({ radius: 0.25 }),
        )
        .tag(tags.ai),
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
            modelComponent({ modelName: item, castShadow: true, data: modelDB[item] }),
            positionComponent({ position: [i * 3 - 12, 0, 8] }),
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

// Crate
world.ecs.registerEntity(
    new Entity().addComponents(
        modelComponent({ modelName: 'crate', data: modelDB['crate'] }),
        positionComponent({ position: [5, 0, 5] }),
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
torches.forEach((posZ) => {
    world.ecs.registerEntity(
        new Entity().addComponents(
            modelComponent({ modelName: 'torchWall', data: modelDB['torchWall'] }),
            positionComponent({ position: [-16, 1.5, posZ] }),
            pointLightComponent({
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
        modelComponent({ modelName: 'chest_gold', data: modelDB['chest_gold'] }),
        positionComponent({ position: [-6, 0, -6] }),
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
    world.ecs.registerEntity(
        new Entity().addComponents(
            modelComponent({ modelName: 'stoneWallTop', data: modelDB['stoneWallTop'] }),
            positionComponent({ position: [-16, 0, i - 15] }),
            colliderComponent({ collider: { type: 'box', width: 0.25, height: 2, depth: 2 } }),
        ),
    )
}

// Grass
const makePos = (): [number, number, number] => [Math.random() * 30 - 15, 0, Math.random() * 30 - 15]
for (let i = 0; i < 200; i += 1) {
    world.ecs.registerEntity(
        new Entity().addComponents(modelComponent({ modelName: 'grass', data: modelDB['grass'] }), positionComponent({ position: makePos() })),
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
