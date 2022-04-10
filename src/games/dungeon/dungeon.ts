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

const loop = () => {
    requestAnimationFrame(() => {
        const delta = Math.min(clock.getDelta(), 0.050)

        try {
            inputSystem(componentManager, inputManager)
            movementSystem(delta, componentManager)
            Systems.cameraSystem(delta, componentManager)
            Systems.animationSystem(delta, componentManager)
            renderer.tick(componentManager) // TODO refactor how this is called
            renderer.render(delta)
            loop()
        } catch (error) {
            /* eslint-disable no-console */
            console.error(error)
        }
    })
}

const init = (canvas: HTMLCanvasElement) => {
    renderer = new Renderer({ canvas })
    // renderer.setDebugMode('debug')

    inputManager = new InputManager({ domElement: canvas, keymap: DEFAULT_KEYMAP })

    canvas.insertAdjacentElement('afterend', renderer.infoDomElement)

    componentManager.addComponent(new Components.LevelComponent(createEntity(), {
        tiles: tilesGenerator([64, 64], 421),
    }))

    componentManager.addComponent(new AmbientLightComponent(createEntity(), {
        color: 0x101010,
        intensity: 1,
    }))

    const playerEntity = createEntity()
    componentManager.addComponents([
        new Components.AnimationComponent(playerEntity, 'idle'),
        // new Components.AttackComponent(playerEntity, { damage: 5, range: 2 }),
        new Components.CameraComponent(playerEntity),
        // new Components.CollisionComponent(playerEntity),
        // new HealthComponent(playerEntity, { health: 20 }),
        new HeroComponent(playerEntity),
        new InputComponent(playerEntity, DEFAULT_KEYMAP),
        new DirectionalLightComponent(playerEntity),
        new ModelComponent<typeof modelDB>(playerEntity, { modelName: 'rogue' }),
        new PositionComponent(playerEntity, { position: [0, 0, -1] }),
    ])

    const skelEntity = createEntity()
    componentManager.addComponents([
        new Components.AnimationComponent(skelEntity, 'idle'),
        new ModelComponent(skelEntity, { modelName: 'skeleton' }),
        new PositionComponent(skelEntity, { position: [1, 0, 2] }),
    ])

    const items = ['chest_gold', 'barrel', 'column', 'entrance', 'rock_1', 'torch', 'stoneWall']
    items.forEach((item, i) => {
        const entityId = createEntity()
        componentManager.addComponents([
            new ModelComponent(entityId, { modelName: item }),
            new PositionComponent(entityId, { position: [i * 3 - 8, 0, 8] }),
        ])
    })

    dispatch({ type: 'TEST' })

    loop()
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
