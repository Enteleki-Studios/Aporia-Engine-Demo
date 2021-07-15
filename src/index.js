import * as THREE from 'three'
import * as ROT from 'rot-js'
import ECS from 'ECS'
import * as Systems from 'Systems'

import Light from 'Components/Light'
import Plane from 'Components/Plane'
import Model from 'Components/Model'
import Position from 'Components/Position'
import Animation from 'Components/Animation'
import Hero from 'Components/Hero'
import Input from 'Components/Input'
import Camera from 'Components/Camera'

import 'style/root.scss'

window.addEventListener('DOMContentLoaded', () => {
    const DungeonECS = new ECS()

    DungeonECS.registerSystem(new Systems.PlayerInput())
    DungeonECS.registerSystem(new Systems.Movement())
    DungeonECS.registerSystem(new Systems.Animation())
    DungeonECS.registerSystem(new Systems.Camera())
    DungeonECS.registerSystem(new Systems.Renderer({
        canvas: document.getElementById('WebGLCanvas'),
        aspect: (1280 / 720),
    }))

    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'AmbientLight', {
        color: 0x101010,
        intensity: 5,
    }))

    const playerEntity = DungeonECS.createEntity()
    DungeonECS.addComponents([
        new Hero(playerEntity),
        new Model(playerEntity, { modelId: 1 }),
        new Input(playerEntity),
        new Position(playerEntity, new THREE.Vector3(2, 0, 2), new THREE.Quaternion()),
        new Animation(playerEntity, 'idle'),
        new Camera(playerEntity),
        new Light(playerEntity, 'DirectionalLight'),
    ])

    DungeonECS.start()

    // //////

    ROT.RNG.setSeed(421)
    const mapSize = [200, 200]
    const map = new ROT.Map.Digger(mapSize[0], mapSize[1], {
        roomWidth: [10, 50],
        roomHeight: [12, 50],
        corridorLength: [3, 5],
        dugPercentage: 0.3,
    })
    const display = new ROT.Display({
        width: mapSize[0],
        height: mapSize[1],
        fontSize: 8,
    })
    const debugCanvas = display.getContainer()
    const mapScale = 3
    debugCanvas.style = `width: ${mapSize[0] * mapScale}px; height: ${mapSize[0] * mapScale}px`
    document.getElementById('debug').append(debugCanvas)
    map.create(display.DEBUG)

    const drawDoor = (x, y) => {
        display.draw(x, y, '', '', 'red')
    }

    const rooms = map.getRooms()
    rooms.forEach((room) => {
        DungeonECS.addComponent(new Plane(DungeonECS.createEntity(), {
            width: room.getRight() - room.getLeft(),
            height: room.getBottom() - room.getTop(),
            color: 0x44475a,
            position: new THREE.Vector3(room.getCenter()[0], 0, room.getCenter()[1]),
        }))

        room.getDoors(drawDoor)
    })
})
