import {
    AmbientLightComponent,
    HealthComponent,
    DirectionalLightComponent,
    HeroComponent,
    InputManager,
    ModelComponent,
    DEFAULT_KEYMAP,
    InputSystem,
    InputComponent,
    PositionComponent,
    HitboxComponent,
    ThirdPersonCameraSystem,
    CameraComponent,
    CameraTargetComponent,
    VelocityComponent,
    SunTargetComponent,
    SunSystem,
    World,
    MovementSystem,
    ApplyVelocitySystem,
    DamageSystem,
    DamagingComponent,
} from 'gengine'

import { AppDispatch } from 'dungeon/store'

import * as Systems from 'dungeon/systems'
import * as Components from 'dungeon/components'
import { Renderer } from 'dungeon/Renderer'
// import tilesGenerator from 'utils/tilesGenerator'

import modelDB from 'modelDB'

const world = new World()

let dispatch: AppDispatch

const init = (canvas: HTMLCanvasElement) => {
    const renderer = new Renderer({ canvas })
    // renderer.setDebugMode('debug')
    // renderer.setDebugMode('sideBySide')
    canvas.insertAdjacentElement('afterend', renderer.infoDomElement)

    const inputManager = new InputManager({ domElement: canvas, keymap: DEFAULT_KEYMAP })
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

    world.ecs.registerSystems([
        new InputSystem(inputManager),
        new MovementSystem(),
        new Systems.CollisionSystem(),
        new ApplyVelocitySystem(),
        new DamageSystem(),
        new ThirdPersonCameraSystem(),
        new SunSystem(),
        new Systems.AnimationSystem(),
        new Systems.RendererSystem(renderer),
    ])

    // Lighting
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new AmbientLightComponent({
            color: 0xaaaaff,
            intensity: 0.2,
        }),
        new DirectionalLightComponent([10, 15, 10]),
    )

    // Camera
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new CameraComponent(),
        new InputComponent(DEFAULT_KEYMAP),
    )

    // Player
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new Components.AnimationComponent('idle'),
        // new Components.AttackComponent(playerEntity, { damage: 5, range: 2 }),
        new Components.CollidableComponent(),
        new CameraTargetComponent(),
        new SunTargetComponent(),
        new HitboxComponent(modelDB.wizard.radius),
        new HealthComponent(20),
        new HeroComponent(),
        new InputComponent(DEFAULT_KEYMAP),
        new ModelComponent<typeof modelDB>({ modelName: 'wizard' }),
        new PositionComponent({ position: [0, 0, -1] }),
        new VelocityComponent({}),
        new DamagingComponent({
            radius: 1,
            theta: 2,
            spoolUp: 0.25,
            coolDown: 0.5,
            damage: 5,
        }),
    )

    // Skeleton
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new Components.AnimationComponent('idle'),
        new ModelComponent({ modelName: 'skeleton' }),
        new PositionComponent({ position: [1, 0, 2] }),
        new HealthComponent(20),
        new HitboxComponent(0.25),
    )

    // Slime
    world.ecs.addComponents(
        world.ecs.createEntity(),
        new Components.AnimationComponent('idle'),
        new ModelComponent({ modelName: 'slime' }),
        new PositionComponent({ position: [4, 0, 2] }),
        new HealthComponent(20),
        new HitboxComponent(0.25),
    )

    // Items
    const items = ['chest_gold', 'barrel', 'column', 'entrance', 'rock_1', 'torch', 'stoneWall', 'cart', 'crate']
    items.forEach((item, i) => {
        world.ecs.addComponents(
            world.ecs.createEntity(),
            new ModelComponent({ modelName: item }),
            new PositionComponent({ position: [i * 3 - 12, 0, 8] }),
            new HitboxComponent(modelDB[item].radius),
        )
    })

    // Grass
    const makePos: () => [number, number, number] = () => ([
        Math.random() * 30 - 15,
        0,
        Math.random() * 30 - 15,
    ])
    for (let i = 0; i < 200; i += 1) {
        world.ecs.addComponents(
            world.ecs.createEntity(),
            new ModelComponent({ modelName: 'grass' }),
            new PositionComponent({ position: makePos() }),
        )
    }

    world.start()

    dispatch({ type: 'TEST' })
}

const addDispatch = (d: AppDispatch) => {
    dispatch = d
}

export default {
    init,
    addDispatch,
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
