import { Clock } from 'three'

import {
    AmbientLightComponent,
    ComponentManager,
    DirectionalLightComponent,
    HeroComponent,
    InputManager,
    ModelComponent,
    createEntity,
    DEFAULT_KEYMAP,
    inputSystem,
    movementSystem,
    InputComponent,
    PositionComponent,
    HitboxComponent,
} from 'gengine'

import { AppDispatch } from 'dungeon/store'

import * as Systems from 'dungeon/systems'
import * as Components from 'dungeon/components'
import { Renderer } from 'dungeon/Renderer'
import tilesGenerator from 'utils/tilesGenerator'

import modelDB from 'modelDB'

const componentManager = new ComponentManager()
let inputManager: InputManager

const clock = new Clock()

let dispatch: AppDispatch
let renderer: Renderer

let delta = 0

const tick = () => {
    delta = Math.min(clock.getDelta(), 0.05)

    try {
        inputSystem(componentManager, inputManager)
        movementSystem(delta, componentManager)

        Systems.collisionSystem(componentManager)

        Systems.cameraSystem(componentManager)
        Systems.sunSystem(componentManager)

        Systems.animationSystem(delta, componentManager)

        Systems.rendererSystem(componentManager, renderer)
        renderer.render(delta)

        requestAnimationFrame(tick)
    } catch (error) {
        /* eslint-disable no-console */
        console.error(error)
    }
}

const init = (canvas: HTMLCanvasElement) => {
    renderer = new Renderer({ canvas })
    // renderer.setDebugMode('debug')
    // renderer.setDebugMode('sideBySide')

    inputManager = new InputManager({ domElement: canvas, keymap: DEFAULT_KEYMAP })

    canvas.insertAdjacentElement('afterend', renderer.infoDomElement)

    componentManager.addComponent(new Components.LevelComponent(createEntity(), {
        tiles: tilesGenerator([64, 64], 421),
    }))

    componentManager.addComponent(new AmbientLightComponent(createEntity(), {
        color: 0xaaaaff,
        intensity: 0.2,
    }))

    const playerEntity = createEntity()
    componentManager.addComponents([
        new Components.AnimationComponent(playerEntity, 'idle'),
        // new Components.AttackComponent(playerEntity, { damage: 5, range: 2 }),
        new Components.CameraComponent(playerEntity),
        new Components.CollidesComponent(playerEntity),
        new HitboxComponent(playerEntity, modelDB.wizard.radius),
        // new HealthComponent(playerEntity, { health: 20 }),
        new HeroComponent(playerEntity),
        new InputComponent(playerEntity, DEFAULT_KEYMAP),
        new DirectionalLightComponent(playerEntity),
        new ModelComponent<typeof modelDB>(playerEntity, { modelName: 'wizard' }),
        new PositionComponent(playerEntity, { position: [0, 0, -1] }),
    ])

    const skelEntity = createEntity()
    componentManager.addComponents([
        new Components.AnimationComponent(skelEntity, 'idle'),
        new ModelComponent(skelEntity, { modelName: 'skeleton' }),
        new PositionComponent(skelEntity, { position: [1, 0, 2] }),
    ])

    const items = ['chest_gold', 'barrel', 'column', 'entrance', 'rock_1', 'torch', 'stoneWall', 'cart', 'crate']
    items.forEach((item, i) => {
        const entityId = createEntity()
        componentManager.addComponents([
            new ModelComponent(entityId, { modelName: item }),
            new PositionComponent(entityId, { position: [i * 3 - 12, 0, 8] }),
            new HitboxComponent(entityId, modelDB[item].radius),
        ])
    })

    const makePos: () => [number, number, number] = () => ([
        Math.random() * 30 - 15,
        0,
        Math.random() * 30 - 15,
    ])
    for (let i = 0; i < 200; i += 1) {
        const entityId = createEntity()
        componentManager.addComponents([
            new ModelComponent(entityId, { modelName: 'grass' }),
            new PositionComponent(entityId, { position: makePos() }),
        ])
    }

    dispatch({ type: 'TEST' })

    tick()
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
