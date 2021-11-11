// import * as THREE from 'three'
import { ECS } from 'ECS'
import * as Systems from './Systems'

import {
    // AI,
    // Animation,
    // Attack,
    // Camera,
    // Collides,
    // Health,
    // Hero,
    // Input,
    Light,
    Level,
    // Model,
    // Position,
} from './Components'

export default class Dungeon {
    ecs: object | null = null
    init(canvas: HTMLElement) {
        const DungeonECS = new ECS()
        this.ecs = DungeonECS

        DungeonECS.registerSystem(new Systems.Level({
            size: [64, 64],
        }))
        // DungeonECS.registerSystem(new Systems.PlayerInput({
        //     canvas,
        // }))
        // DungeonECS.registerSystem(new Systems.AIInput())
        // DungeonECS.registerSystem(new Systems.Movement())
        // DungeonECS.registerSystem(new Systems.Collision())
        // DungeonECS.registerSystem(new Systems.Combat())
        // DungeonECS.registerSystem(new Systems.CollisionEffects())
        // DungeonECS.registerSystem(new Systems.Camera())
        // DungeonECS.registerSystem(new Systems.Animation())
        DungeonECS.registerSystem(new Systems.Renderer({
            canvas,
            aspect: (1280 / 720),
        }))

        DungeonECS.addComponent(new Level(DungeonECS.createEntity(), { seed: 421 }))

        DungeonECS.addComponent(new Light(DungeonECS.createEntity(), {
            lightType: 'AmbientLight',
            color: 0x101010,
            intensity: 2,
        }))

        // const playerEntity = DungeonECS.createEntity()
        // DungeonECS.addComponents([
        //     new Animation(playerEntity, 'idle'),
        //     new Attack(playerEntity, { damage: 5, range: 2 }),
        //     new Camera(playerEntity),
        //     new Collides(playerEntity),
        //     new Health(playerEntity, { health: 20 }),
        //     new Hero(playerEntity),
        //     new Input(playerEntity),
        //     new Light(playerEntity, { lightType: 'DirectionalLight' }),
        //     new Model(playerEntity, { modelId: 2 }),
        //     new Position(playerEntity, new THREE.Vector3(64, 0, 64)),
        // ])

        // const slimeEntity = DungeonECS.createEntity()
        // DungeonECS.addComponents([
        //     new Animation(slimeEntity, 'idle'),
        //     new AI(slimeEntity),
        //     new Input(slimeEntity),
        //     new Collides(slimeEntity),
        //     new Health(slimeEntity, { health: 20 }),
        //     new Model(slimeEntity, { modelId: 3 }),
        //     new Position(slimeEntity, new THREE.Vector3(64, 0, 66)),
        // ])

        // const batEntity = DungeonECS.createEntity()
        // DungeonECS.addComponents([
        //     new Animation(batEntity, 'idle'),
        //     new AI(batEntity),
        //     new Input(batEntity),
        //     new Collides(batEntity),
        //     new Model(batEntity, { modelId: 4 }),
        //     new Position(batEntity, new THREE.Vector3(60, 1, 66)),
        // ])

        // const skelEntity = DungeonECS.createEntity()
        // DungeonECS.addComponents([
        //     new Animation(skelEntity, 'idle'),
        //     new AI(skelEntity),
        //     new Input(skelEntity),
        //     new Collides(skelEntity),
        //     new Model(skelEntity, { modelId: 5 }),
        //     new Position(skelEntity, new THREE.Vector3(64, 0, 70)),
        // ])

        DungeonECS.start()
    }
}
