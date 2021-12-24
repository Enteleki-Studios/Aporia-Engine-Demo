import * as THREE from 'three'

import { ECS, createEntity } from 'ECS'
import type { AppDispatch } from 'store'

import * as Systems from 'systems'
import {
    // AI,
    AmbientLightComponent,
    AnimationComponent,
    // Attack,
    CameraComponent,
    // Collides,
    DirectionalLightComponent,
    HealthComponent,
    HeroComponent,
    InputComponent,
    Level,
    ModelComponent,
    PositionComponent,
} from 'components'
import tilesGenerator from 'utils/tilesGenerator'

export default class Dungeon {
    ecs: ECS
    dispatch?: AppDispatch

    constructor() {
        this.ecs = new ECS()
    }

    init(canvas: HTMLElement) {
        if (this.dispatch) {
            this.dispatch({ type: 'TEST' })
        }

        const DungeonECS = this.ecs

        // DungeonECS.registerSystem(new Systems.Level())
        DungeonECS.registerSystem(new Systems.PlayerInput({
            canvas,
        }))
        // DungeonECS.registerSystem(new Systems.AIInput())
        DungeonECS.registerSystem(new Systems.Movement())
        // DungeonECS.registerSystem(new Systems.Collision())
        // DungeonECS.registerSystem(new Systems.Combat())
        // DungeonECS.registerSystem(new Systems.CollisionEffects())
        DungeonECS.registerSystem(new Systems.Camera())
        DungeonECS.registerSystem(new Systems.Animation())
        DungeonECS.registerSystem(new Systems.Renderer({
            canvas,
            aspect: (1280 / 720),
        }))

        DungeonECS.addComponent(new Level(createEntity(), {
            tiles: tilesGenerator([64, 64], 421),
        }))

        DungeonECS.addComponent(new AmbientLightComponent(createEntity(), {
            color: 0x101010,
            intensity: 2,
        }))

        const playerEntity = createEntity()
        DungeonECS.addComponents([
            new AnimationComponent(playerEntity, 'idle'),
            // new Attack(playerEntity, { damage: 5, range: 2 }),
            new CameraComponent(playerEntity),
            // new Collides(playerEntity),
            new HealthComponent(playerEntity, { health: 20 }),
            new HeroComponent(playerEntity),
            new InputComponent(playerEntity),
            new DirectionalLightComponent(playerEntity),
            new ModelComponent(playerEntity, { modelId: 1 }),
            new PositionComponent(playerEntity, new THREE.Vector3(64, 0, 64)),
        ])

        const slimeEntity = createEntity()
        DungeonECS.addComponents([
            new AnimationComponent(slimeEntity, 'idle'),
            // new AI(slimeEntity),
            // new Input(slimeEntity),
            // new Collides(slimeEntity),
            new HealthComponent(slimeEntity, { health: 20 }),
            new ModelComponent(slimeEntity, { modelId: 2 }),
            new PositionComponent(slimeEntity, new THREE.Vector3(64, 0, 66)),
        ])

        // const batEntity = DungeonECS.createEntity()
        // DungeonECS.addComponents([
        //     new Animation(batEntity, 'idle'),
        //     new AI(batEntity),
        //     new Input(batEntity),
        //     new Collides(batEntity),
        //     new Model(batEntity, { modelId: 3 }),
        //     new Position(batEntity, new THREE.Vector3(60, 1, 66)),
        // ])

        // const skelEntity = DungeonECS.createEntity()
        // DungeonECS.addComponents([
        //     new Animation(skelEntity, 'idle'),
        //     new AI(skelEntity),
        //     new Input(skelEntity),
        //     new Collides(skelEntity),
        //     new Model(skelEntity, { modelId: 4 }),
        //     new Position(skelEntity, new THREE.Vector3(64, 0, 70)),
        // ])

        DungeonECS.start()
    }

    addDispatch(dispatch: AppDispatch) {
        this.dispatch = dispatch
    }
}
