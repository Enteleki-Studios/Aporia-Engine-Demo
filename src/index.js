import * as THREE from 'three'
import ECS from 'ECS'
import * as Systems from 'Systems'

import Light from 'Components/Light'
import Plane from 'Components/Plane'
import Model from 'Components/Model'
import Position from 'Components/Position'
import Animation from 'Components/Animation'
import PlayerControl from 'Components/PlayerControl'
import SingletonInput from 'Components/SingletonInput'

import 'style/root.scss'

window.addEventListener('DOMContentLoaded', () => {
    const DungeonECS = new ECS()

    DungeonECS.registerSystem(new Systems.Renderer({
        canvasId: 'WebGLCanvas',
        dimensions: [1280, 720],
    }, DungeonECS))

    DungeonECS.registerSystem(new Systems.Input(DungeonECS))
    DungeonECS.registerSystem(new Systems.Movement(DungeonECS))

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
    DungeonECS.addComponent(new Model(playerEntity, { modelId: 1 }))
    DungeonECS.addComponent(new SingletonInput(playerEntity))
    DungeonECS.addComponent(new Position(playerEntity, new THREE.Vector3(2, 0, 2), new THREE.Quaternion()))
    DungeonECS.addComponent(new Animation(playerEntity, 'idle'))
    DungeonECS.addComponent(new PlayerControl(playerEntity))
})
