import * as THREE from 'three'
import * as GLHelpers from 'GLHelpers'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

import 'style/root.scss'

class ECS {
    Init() {
        this._animations = {}
        this._clock = new THREE.Clock()

        this._stats = new Stats()
        document.getElementsByClassName('GLWindow')[0].appendChild(this._stats.dom)

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
        const far = 500
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this._camera.position.set(-7, 5, -2)
        this._OnWindowResize()

        this._scene = new THREE.Scene()
        this._scene.background = new THREE.Color(0xbd93f9)
        this._scene.fog = new THREE.Fog(this._scene.background, 1, 100)

        const axesHelper = new THREE.AxesHelper(1)
        this._scene.add(axesHelper)

        const light = new GLHelpers.DirectionalLight(0xFFFFFF, 1.0)
        this._scene.add(light)
        this._scene.add(light.helper)
        this._scene.add(light.shadowHelper)

        const hemiLight = new THREE.HemisphereLight(0xbd93f9, 0x44475a, 0.6)
        hemiLight.position.set(0, 5, 0)
        this._scene.add(hemiLight)

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 1)
        this._scene.add(hemiLightHelper)

        // const ambientLight = new THREE.AmbientLight(0x101010, 10)
        // this._scene.add(ambientLight)

        const sky = new GLHelpers.SkyBox()
        this._scene.add(sky)

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement,
        )
        controls.minDistance = 3
        controls.maxDistance = 50
        controls.target.set(0, 2, 0)
        controls.update()

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x6272a4,
            }),
        )
        plane.castShadow = false
        plane.receiveShadow = true
        plane.rotation.x = -Math.PI / 2
        plane.position.set(5, 0, 5)
        this._scene.add(plane)

        this._LoadAnimatedModel()

        const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
        const cubeMat = new THREE.MeshStandardMaterial({ color: 0x50fa7b })
        const cube = new THREE.Mesh(cubeGeo, cubeMat)
        cube.castShadow = true
        cube.receiveShadow = true
        // cube.position.set(5, 0.5, 5)
        cube.position.set(3, 0.5, 3)
        this._scene.add(cube)

        this.tick()
    }

    _LoadAnimatedModel() {
        const loader = new FBXLoader()
        loader.setPath('./resources/models/')
        loader.load('Rogue.fbx', (fbx) => {
            this._scene.add(fbx)

            fbx.scale.setScalar(0.01)
            fbx.position.set(1, 0, 1)

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

    _OnWindowResize() {
        const { width, height } = this._threejs.domElement
        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        this._threejs.setSize(width, height)
    }

    tick() {
        requestAnimationFrame(() => {
            const delta = this._clock.getDelta()
            this.tick()
            this._threejs.render(this._scene, this._camera)
            if (this._mixer) {
                this._mixer.update(delta)
            }
            this._stats.update()
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const App = new ECS()
    App.Init()
})
