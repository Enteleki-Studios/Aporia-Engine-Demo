import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import 'style/root.scss'

class ECS {
    #animations = {}
    Init() {
        this._animations = {}

        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById('WebGLCanvas'),
        })
        this._threejs.outputEncoding = THREE.sRGBEncoding
        this._threejs.gammaFactor = 2.2
        this._threejs.shadowMap.enabled = true
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap
        this._threejs.setPixelRatio(window.devicePixelRatio)

        window.addEventListener('resize', () => {
            this._OnWindowResize()
        }, false)

        const fov = 60
        const aspect = 1920 / 1080
        const near = 1.0
        const far = 1000.0
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this._camera.position.set(75, 20, 0)
        this._OnWindowResize()

        this._scene = new THREE.Scene()

        const light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
        light.position.set(20, 100, 10)
        light.target.position.set(0, 0, 0)
        light.castShadow = true
        light.shadow.bias = -0.001
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
        light.shadow.camera.near = 0.1
        light.shadow.camera.far = 500.0
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 500.0
        light.shadow.camera.left = 100
        light.shadow.camera.right = -100
        light.shadow.camera.top = 100
        light.shadow.camera.bottom = -100
        this._scene.add(light)

        const ambientLight = new THREE.AmbientLight(0x101010, 10)
        this._scene.add(ambientLight)

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement,
        )
        controls.target.set(0, 20, 0)
        controls.update()

        const loader = new THREE.CubeTextureLoader()
        const texture = loader.load([
            '/resources/skybox/posx.jpg',
            '/resources/skybox/negx.jpg',
            '/resources/skybox/posy.jpg',
            '/resources/skybox/negy.jpg',
            '/resources/skybox/posz.jpg',
            '/resources/skybox/negz.jpg',
        ])
        this._scene.background = texture

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x6272a4,
            }),
        )
        plane.castShadow = false
        plane.receiveShadow = true
        plane.rotation.x = -Math.PI / 2
        this._scene.add(plane)

        // const box = new THREE.Mesh(
        //     new THREE.BoxGeometry(2, 2, 2),
        //     new THREE.MeshStandardMaterial({
        //         color: 0xFFFFFF,
        //     }))
        // box.position.set(0, 1, 0)
        // box.castShadow = true
        // box.receiveShadow = true
        // this._scene.add(box)

        this._LoadAnimatedModel()

        this.tick()
    }

    _LoadAnimatedModel() {
        const loader = new FBXLoader()
        loader.setPath('./resources/models/')
        loader.load('Rogue.fbx', (fbx) => {
            this._scene.add(fbx)

            fbx.scale.setScalar(0.1)

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

    _OnWindowResize() {
        const { width, height } = this._threejs.domElement
        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        this._threejs.setSize(width, height)
    }

    tick() {
        requestAnimationFrame((t) => {
            if (!this._lastTick) {
                this._lastTick = t
            }
            const delta = Math.min(1.0 / 30.0, (t - this._lastTick) * 0.001)
            this.tick()
            this._threejs.render(this._scene, this._camera)
            if (this._mixer) {
                this._mixer.update(delta)
            }
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const App = new ECS()
    App.Init()
})
