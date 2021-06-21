import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import ECS from 'ECS'
import * as Systems from 'Systems'

import Axes from 'Components/Axes'
import Light from 'Components/Light'
import Stats from 'Components/Stats'
import OrbitControls from 'Components/OrbitControls'
import SkyBox from 'Components/SkyBox'
import Plane from 'Components/Plane'

import 'style/root.scss'

const renderDimensions = [1280, 720]

class Gammme {
    Init() {
        // this._animations = {}
        // this._clock = new THREE.Clock()

        // this._threejs = new THREE.WebGLRenderer({
        //     antialias: true,
        //     canvas: document.getElementById('WebGLCanvas'),
        // })
        // this._threejs.outputEncoding = THREE.sRGBEncoding
        // this._threejs.gammaFactor = 2.2
        // this._threejs.shadowMap.enabled = true
        // this._threejs.shadowMap.type = THREE.PCFSoftShadowMap
        // this._threejs.setPixelRatio(window.devicePixelRatio)

        // window.addEventListener('resize', () => {
        //     this._OnWindowResize()
        // }, false)

        // const fov = 60
        // const aspect = 1920 / 1080
        // const near = 1.0
        // const far = 500
        // this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        // this._camera.position.set(-7, 5, -2)
        // this._OnWindowResize()

        // this._scene = new THREE.Scene()
        // this._scene.background = new THREE.Color(0xbd93f9)
        // this._scene.fog = new THREE.Fog(this._scene.background, 1, 100)

        // const axesHelper = new THREE.AxesHelper(1)
        // this._scene.add(axesHelper)

        // const light = new GLHelpers.DirectionalLight(0xFFFFFF, 1.0)
        // this._scene.add(light)
        // this._scene.add(light.helper)
        // this._scene.add(light.shadowHelper)

        // const ambientLight = new THREE.AmbientLight(0x101010, 5)
        // this._scene.add(ambientLight)

        // const sky = new GLHelpers.SkyBox()
        // this._scene.add(sky)

        // const controls = new OrbitControls(
        //     this._camera, this._threejs.domElement,
        // )
        // controls.minDistance = 3
        // controls.maxDistance = 50
        // controls.target.set(2, 2, 2)
        // controls.update()

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x44475a,
            }),
        )
        plane.castShadow = false
        plane.receiveShadow = true
        plane.rotation.x = -Math.PI / 2
        plane.position.set(5, 0, 5)
        this._scene.add(plane)

        this._LoadAnimatedModel()
        this._LoadWalls()
        this._LoadFloor()

        // const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
        // const cubeMat = new THREE.MeshStandardMaterial({ color: 0x50fa7b })
        // const cube = new THREE.Mesh(cubeGeo, cubeMat)
        // cube.castShadow = true
        // cube.receiveShadow = true
        // cube.position.set(5, 0.5, 5)
        // // cube.position.set(3, 0.5, 3)
        // this._scene.add(cube)

        this.tick()
    }

    _LoadAnimatedModel() {
        const loader = new FBXLoader()
        loader.setPath('./resources/models/')
        loader.load('Rogue.fbx', (fbx) => {
            this._scene.add(fbx)

            fbx.scale.setScalar(0.006)
            fbx.position.set(2, 0, 2)

            const textureLoader = new THREE.TextureLoader()
            const texture = textureLoader.load('./resources/models/Textures/Rogue_Texture.png')
            texture.encoding = THREE.sRGBEncoding
            texture.flipY = true

            fbx.traverse((c) => {
                c.castShadow = true
                c.receiveShadow = true
                if (c.material) {
                    c.material.map = texture
                    c.material.side = THREE.DoubleSide
                    // c.material.wireframe = true
                }
            })

            this._mixer = new THREE.AnimationMixer(fbx)
            fbx.animations.forEach((anim) => {
                this._animations[anim.name] = {
                    clip: anim,
                    action: this._mixer.clipAction(anim),
                }
            })
            // console.debug(this._animations)
            const { action } = this._animations['CharacterArmature|Attacking_Idle']
            action.time = 0.0
            action.enabled = true
            action.setEffectiveTimeScale(1.0)
            action.setEffectiveWeight(1.0)
            action.play()
        })
    }

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

    _LoadFloor() {
        const loader = new FBXLoader()
        loader.setPath('./resources/models/Env/')
        loader.load('ModularFloor.fbx', (fbx) => {
            fbx.scale.setScalar(0.01)
            fbx.traverse((c) => {
                c.castShadow = true
                c.receiveShadow = true
            })
            this._scene.add(fbx)
            fbx.position.set(9, -0.3, 1)
        })
    }

    _OnWindowResize() {
        this._camera.aspect = renderDimensions[0] / renderDimensions[1]
        this._camera.updateProjectionMatrix()
        this._threejs.setSize(renderDimensions[0], renderDimensions[1])
    }

    tick() {
        requestAnimationFrame(() => {
            const delta = this._clock.getDelta()
            this.tick()
            this._threejs.render(this._scene, this._camera)
            if (this._mixer) {
                this._mixer.update(delta)
            }
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // const TheGame = new Gammme()
    // TheGame.Init()

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
})
