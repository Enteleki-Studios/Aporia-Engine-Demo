import * as THREE from 'three'
import ECS from 'ECS'
import * as Systems from 'Systems'

import Light from 'Components/Light'
import Plane from 'Components/Plane'
import Model from 'Components/Model'
import Position from 'Components/Position'
import Animation from 'Components/Animation'
import Hero from 'Components/Hero'
import Input from 'Components/Input'

import 'style/root.scss'

window.addEventListener('DOMContentLoaded', () => {
    const DungeonECS = new ECS()

    DungeonECS.registerSystem(new Systems.PlayerInput())
    DungeonECS.registerSystem(new Systems.Movement())
    DungeonECS.registerSystem(new Systems.Animation())
    DungeonECS.registerSystem(new Systems.Renderer({
        canvas: document.getElementById('WebGLCanvas'),
        aspect: (1280 / 720),
    }))

    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'DirectionalLight'))
    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'AmbientLight', {
        color: 0x101010,
        intensity: 5,
    }))
    DungeonECS.addComponent(new Plane(DungeonECS.createEntity(), {
        width: 10,
        height: 10,
        color: 0x44475a,
        position: new THREE.Vector3(5, 0, 5),
    }))

    const playerEntity = DungeonECS.createEntity()
    DungeonECS.addComponents([
        new Hero(playerEntity),
        new Model(playerEntity, { modelId: 1 }),
        new Input(playerEntity),
        new Position(playerEntity, new THREE.Vector3(2, 0, 2), new THREE.Quaternion()),
        new Animation(playerEntity, 'idle'),
    ])

    DungeonECS.start()
})
