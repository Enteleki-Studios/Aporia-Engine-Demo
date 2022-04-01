import * as THREE from 'three'

import { ECS, createEntity, DirectionalLightComponent, HeroComponent, ModelComponent } from 'gengine'
import type { AppDispatch } from 'dungeon/store'

import * as Systems from 'dungeon/systems'
import * as Components from 'dungeon/components'
import tilesGenerator from 'utils/tilesGenerator'

import modelDB from 'modelDB'

export class Dungeon {
    ecs: ECS
    dispatch?: AppDispatch

    constructor() {
        this.ecs = new ECS()
    }

    init(canvas: HTMLCanvasElement) {
        const DungeonECS = this.ecs

        // DungeonECS.registerSystem(new Systems.Level())
        // DungeonECS.registerSystem(new Systems.PlayerInput({
        // canvas,
        // }))
        // DungeonECS.registerSystem(new Systems.AIInput())
        // DungeonECS.registerSystem(new Systems.Movement())
        // DungeonECS.registerSystem(new Systems.Collision())
        // DungeonECS.registerSystem(new Systems.Combat())
        // DungeonECS.registerSystem(new Systems.CollisionEffects())
        DungeonECS.registerSystem(new Systems.Camera())
        // DungeonECS.registerSystem(new Systems.Animation())
        DungeonECS.registerSystem(new Systems.Renderer({
            canvas,
            aspect: (1280 / 720),
        }))

        DungeonECS.addComponent(new Components.LevelComponent(createEntity(), {
            tiles: tilesGenerator([64, 64], 421),
        }))

        DungeonECS.addComponent(new Components.AmbientLightComponent(createEntity(), {
            color: 0x101010,
            intensity: 2,
        }))

        const playerEntity = createEntity()
        DungeonECS.addComponents([
            // new Components.AnimationComponent(playerEntity, 'idle'),
            // new Components.AttackComponent(playerEntity, { damage: 5, range: 2 }),
            new Components.CameraComponent(playerEntity),
            // new Components.CollisionComponent(playerEntity),
            // new HealthComponent(playerEntity, { health: 20 }),
            new HeroComponent(playerEntity),
            // new Components.InputComponent(playerEntity),
            new DirectionalLightComponent(playerEntity),
            new ModelComponent<typeof modelDB>(playerEntity, { modelName: 'rogue' }),
            new Components.PositionComponent(playerEntity, new THREE.Vector3(64, 0, 64)),
        ])

        // const slimeEntity = createEntity()
        // DungeonECS.addComponents([
        //     new AnimationComponent(slimeEntity, 'idle'),
        //     // new AIComponent(slimeEntity),
        //     new InputComponent(slimeEntity),
        //     new CollisionComponent(slimeEntity),
        //     new HealthComponent(slimeEntity, { health: 20 }),
        //     new ModelComponent(slimeEntity, { modelId: 2 }),
        //     new PositionComponent(slimeEntity, new THREE.Vector3(64, 0, 66)),
        // ])

        // const batEntity = createEntity()
        // DungeonECS.addComponents([
        //     new AnimationComponent(batEntity, 'idle'),
        //     // new AIComponent(batEntity),
        //     new InputComponent(batEntity),
        //     new CollisionComponent(batEntity),
        //     new ModelComponent(batEntity, { modelId: 3 }),
        //     new PositionComponent(batEntity, new THREE.Vector3(60, 1, 66)),
        // ])

        // const skelEntity = createEntity()
        // DungeonECS.addComponents([
        //     new AnimationComponent(skelEntity, 'idle'),
        //     // new AIComponent(skelEntity),
        //     new InputComponent(skelEntity),
        //     new CollisionComponent(skelEntity),
        //     new ModelComponent(skelEntity, { modelId: 4 }),
        //     new PositionComponent(skelEntity, new THREE.Vector3(64, 0, 70)),
        // ])

        // const sprigEntity = createEntity()
        // DungeonECS.addComponents([
        //     new ModelComponent(sprigEntity, { modelId: 5 }),
        //     new PositionComponent(sprigEntity, new THREE.Vector3(62, 0, 64)),
        // ])

        DungeonECS.start()
    }

    addDispatch(dispatch: AppDispatch) {
        this.dispatch = dispatch
    }
}
