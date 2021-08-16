import * as THREE from 'three'
import ECS from 'ECS'
import * as Systems from 'Systems'

import Animation from 'Components/Animation'
import Camera from 'Components/Camera'
import Collides from 'Components/Collides'
import Hero from 'Components/Hero'
import Input from 'Components/Input'
import Light from 'Components/Light'
import Level from 'Components/Level'
import Model from 'Components/Model'
import Position from 'Components/Position'

import 'style/root.scss'

window.addEventListener('DOMContentLoaded', () => {
    const DungeonECS = new ECS()
    const canvas = document.getElementById('WebGLCanvas')

    DungeonECS.registerSystem(new Systems.Level({
        size: [64, 64],
    }))
    DungeonECS.registerSystem(new Systems.PlayerInput({
        canvas,
    }))
    DungeonECS.registerSystem(new Systems.Movement())
    DungeonECS.registerSystem(new Systems.Collision())
    DungeonECS.registerSystem(new Systems.CollisionEffects())
    DungeonECS.registerSystem(new Systems.Camera())
    DungeonECS.registerSystem(new Systems.Animation())
    DungeonECS.registerSystem(new Systems.Renderer({
        canvas,
        aspect: (1280 / 720),
    }))

    DungeonECS.addComponent(new Level(DungeonECS.createEntity(), { seed: 421 }))

    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'AmbientLight', {
        color: 0x101010,
        intensity: 4,
    }))

    const playerEntity = DungeonECS.createEntity()
    DungeonECS.addComponents([
        new Animation(playerEntity, 'idle'),
        new Camera(playerEntity),
        new Collides(playerEntity),
        new Hero(playerEntity),
        new Input(playerEntity),
        new Light(playerEntity, 'DirectionalLight'),
        new Model(playerEntity, { modelId: 2 }),
        new Position(playerEntity, new THREE.Vector3(64, 0, 64)),
    ])

    const slimeEntity = DungeonECS.createEntity()
    DungeonECS.addComponents([
        new Animation(slimeEntity, 'idle'),
        new Model(slimeEntity, { modelId: 3 }),
        new Position(slimeEntity, new THREE.Vector3(64, 0, 66)),
    ])

    const batEntity = DungeonECS.createEntity()
    DungeonECS.addComponents([
        new Animation(batEntity, 'idle'),
        new Model(batEntity, { modelId: 4 }),
        new Position(batEntity, new THREE.Vector3(60, 1, 66)),
    ])

    DungeonECS.start()
})
