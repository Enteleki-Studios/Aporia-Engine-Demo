import * as THREE from 'three'
import * as ROT from 'rot-js'
import ECS from 'ECS'
import * as Systems from 'Systems'

import Light from 'Components/Light'
import Model from 'Components/Model'
import Position from 'Components/Position'
import Animation from 'Components/Animation'
import Hero from 'Components/Hero'
import Input from 'Components/Input'
import Camera from 'Components/Camera'

import 'style/root.scss'

window.addEventListener('DOMContentLoaded', () => {
    const DungeonECS = new ECS()

    ROT.RNG.setSeed(421)
    const mapSize = [64, 64]
    const map = new ROT.Map.Digger(mapSize[0], mapSize[1], {
        roomWidth: [5, 25],
        roomHeight: [5, 25],
        corridorLength: [3, 5],
        dugPercentage: 0.3,
    })
    const display = new ROT.Display({
        width: mapSize[0],
        height: mapSize[1],
        fontSize: 1,
        fg: '#fff',
        bg: '#000',
    })
    const debugCanvas = display.getContainer()
    const mapScale = 6
    debugCanvas.id = 'mapCanvas'
    debugCanvas.style = `width: ${mapSize[0] * mapScale}px; height: ${mapSize[0] * mapScale}px`
    document.getElementById('debug').append(debugCanvas)
    const localMap = []
    map.create((x, y, what) => {
        localMap.push(what)
        display.DEBUG(x, y, what)
    })
    window.mapArray = localMap

    const rooms = map.getRooms()

    const canvas = document.getElementById('WebGLCanvas')
    DungeonECS.registerSystem(new Systems.PlayerInput({
        canvas,
    }))
    DungeonECS.registerSystem(new Systems.Movement())
    DungeonECS.registerSystem(new Systems.Animation())
    DungeonECS.registerSystem(new Systems.Camera())
    DungeonECS.registerSystem(new Systems.Renderer({
        canvas,
        aspect: (1280 / 720),
    }))

    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'AmbientLight', {
        color: 0x101010,
        intensity: 4,
    }))

    const playerEntity = DungeonECS.createEntity()
    const [x, z] = rooms[0].getCenter()
    DungeonECS.addComponents([
        new Hero(playerEntity),
        new Model(playerEntity, { modelId: 1 }),
        new Input(playerEntity),
        new Position(playerEntity, new THREE.Vector3(x * 2, 0, z * 2), new THREE.Quaternion()),
        new Animation(playerEntity, 'idle'),
        new Camera(playerEntity),
        new Light(playerEntity, 'DirectionalLight'),
    ])

    DungeonECS.start()
})
