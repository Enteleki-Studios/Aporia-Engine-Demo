import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import ECS from 'ECS'
import * as Systems from 'Systems'

import Axes from 'Components/Axes'
import Light from 'Components/Light'
import Stats from 'Components/Stats'
import OrbitControls from 'Components/OrbitControls'
import SkyBox from 'Components/SkyBox'
import Plane from 'Components/Plane'
import Model from 'Components/Model'
import Position from 'Components/Position'

import 'style/root.scss'

// this._animations = {}

class Gammme {
    _LoadWalls() {
        const loader = new FBXLoader()
        loader.setPath('./resources/models/Env/')
        loader.load('ModularStoneWall_top.fbx', (f) => {
            f.scale.setScalar(0.01)
            f.traverse((c) => {
                c.castShadow = true
                c.receiveShadow = true
            })
            f.rotateY(Math.PI)
            for (let i = 1; i <= 5; i += 1) {
                const fbx = f.clone()
                this._scene.add(fbx)
                fbx.position.set(10, 1, 1 * 2 * i - 1)
            }
            f.rotateY(-Math.PI / 2)
            for (let i = 1; i <= 5; i += 1) {
                const fbx = f.clone()
                this._scene.add(fbx)
                fbx.position.set(1 * 2 * i - 1, 1, 10)
            }
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const DungeonECS = new ECS()

    DungeonECS.registerSystem(new Systems.Renderer({
        canvasId: 'WebGLCanvas',
        dimensions: [1280, 720],
    }))

    DungeonECS.addComponent(new Stats(DungeonECS.createEntity()))
    DungeonECS.addComponent(new Axes(DungeonECS.createEntity()))
    DungeonECS.addComponent(new OrbitControls(DungeonECS.createEntity()))

    DungeonECS.addComponent(new SkyBox(DungeonECS.createEntity()))

    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'DirectionalLight'))
    DungeonECS.addComponent(new Light(DungeonECS.createEntity(), 'AmbientLight', {
        color: 0x101010,
        intensity: 5,
    }))

    DungeonECS.addComponent(new Plane(DungeonECS.createEntity(), {
        width: 10,
        height: 10,
        color: 0x44475a,
        position: [5, 0, 5],
    }))

    const playerEntity = DungeonECS.createEntity()
    DungeonECS.addComponent(new Model(playerEntity, {
        resourcePath: '/resources/models/rogue/',
        modelPath: 'Rogue.fbx',
        texturePath: 'Rogue_Texture.png',
        scale: 0.006,
        initialPosition: [2, 0, 2],
    }))
    DungeonECS.addComponent(new Position(playerEntity, [2, 0, 2]))
})

// _LoadFloor() {
//     const loader = new FBXLoader()
//     loader.setPath('./resources/models/Env/')
//     loader.load('ModularFloor.fbx', (fbx) => {
//         fbx.scale.setScalar(0.01)
//         fbx.traverse((c) => {
//             c.castShadow = true
//             c.receiveShadow = true
//         })
//         this._scene.add(fbx)
//         fbx.position.set(9, -0.3, 1)
//     })
// }
