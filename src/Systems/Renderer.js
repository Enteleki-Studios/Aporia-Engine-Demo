import * as THREE from 'three'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as GLHelpers from 'GLHelpers'
import modelDB from 'modelDB'

import System from 'ECS/System'

export class Renderer extends System {
    constructor({ canvasId, dimensions }) {
        super()

        this._dimensions = dimensions

        this._clock = new THREE.Clock()

        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById(canvasId),
        })
        this._renderer.outputEncoding = THREE.sRGBEncoding
        this._renderer.gammaFactor = 2.2
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this._renderer.setPixelRatio(window.devicePixelRatio)

        this._scene = new THREE.Scene()
        this._scene.background = new THREE.Color(0xbd93f9)
        this._scene.fog = new THREE.Fog(this._scene.background, 1, 100)

        const fov = 60
        const aspect = this._dimensions[0] / this._dimensions[1]
        const near = 1.0
        const far = 500
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this._camera.position.set(-7, 5, -2)

        window.addEventListener('resize', () => {
            this._onResize()
        }, false)
        this._onResize()

        this.handlers = [
            ['axes', () => this._onAddAxes()],
            ['light', (c) => this._onAddLight(c)],
            ['stats', () => this._onAddStats()],
            ['orbitControls', () => this._onAddOrbitControls()],
            ['skyBox', () => this._onAddSkyBox()],
            ['plane', (c) => this._onAddPlane(c)],
            ['model', (c) => this._onAddModel(c)],
            ['position', (c) => this._onAddPosition(c)],
            ['animation', (c) => this._onAddAnimation(c)],
        ]

        this._jobs = []
        this._models = new Map()
        this._animations = new Map()

        this.update()
    }

    _onAddLight(component) {
        switch (component.lightType) {
            case 'DirectionalLight': {
                const light = new GLHelpers.DirectionalLight(0xFFFFFF, 1.0)
                this._scene.add(light)
                this._scene.add(light.helper)
                this._scene.add(light.shadowHelper)
                break
            }
            case 'AmbientLight': {
                const light = new THREE.AmbientLight(component.color, component.intensity)
                this._scene.add(light)
                break
            }
            default:
                break
        }
    }

    _onAddStats() {
        const s = new Stats()
        document.body.appendChild(s.dom)
        this._jobs.push(() => s.update())
    }

    _onAddAxes() {
        this._scene.add(new THREE.AxesHelper(1))
    }

    _onAddOrbitControls() {
        const controls = new OrbitControls(
            this._camera,
            this._renderer.domElement,
        )
        controls.minDistance = 3
        controls.maxDistance = 50
        controls.target.set(2, 2, 2)
        controls.update()
    }

    _onAddSkyBox() {
        this._scene.add(new GLHelpers.SkyBox())
    }

    _onAddPlane(component) {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(component.width, component.height),
            new THREE.MeshStandardMaterial({
                color: component.color,
            }),
        )
        plane.castShadow = false
        plane.receiveShadow = true
        plane.rotation.x = -Math.PI / 2
        plane.position.set(...component.position)
        this._scene.add(plane)
    }

    _onAddModel(component) {
        const { entity, modelId } = component
        const { resourcePath, modelPath, texturePath, scale, animations: animationIndex } = modelDB[modelId]

        const loader = new FBXLoader()
        loader.setPath(resourcePath)
        loader.load(modelPath, (fbx) => {
            this._scene.add(fbx)

            fbx.scale.setScalar(scale)

            const positionComponent = this._getComponent(entity, 'position')
            if (positionComponent) {
                fbx.position.set(...positionComponent.position)
            }

            const textureLoader = new THREE.TextureLoader()
            const texture = textureLoader.load(resourcePath + texturePath)
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

            this._models.set(entity, fbx)

            if (fbx.animations) {
                const mixer = new THREE.AnimationMixer(fbx)
                const animations = {}
                fbx.animations.forEach((anim) => {
                    animations[anim.name] = {
                        clip: anim,
                        action: mixer.clipAction(anim),
                    }
                })
                this._animations.set(entity, animations)

                const animationComponent = this._getComponent(entity, 'animation')
                if (animationComponent) {
                    const { action } = animations[animationIndex[animationComponent.state]]
                    action.time = 0.0
                    action.enabled = true
                    action.setEffectiveTimeScale(1.0)
                    action.setEffectiveWeight(1.0)
                    action.play()

                    this._jobs.push((delta) => mixer.update(delta))
                }
            }
        })
    }

    _onAddPosition(component) {
        if (this._models.has(component.entity)) {
            this._models.get(component.entity).position.set(...component.position)
        }
        this._saveComponent(component)
    }

    _onAddAnimation(component) {
        if (this._animations.has(component.entity)) {
            this._animations.get(component.entity)[component.state].play()
        }
        this._saveComponent(component)
    }

    _onResize() {
        this._camera.aspect = this._dimensions[0] / this._dimensions[1]
        this._camera.updateProjectionMatrix()
        this._renderer.setSize(this._dimensions[0], this._dimensions[1])
    }

    update() {
        requestAnimationFrame(() => {
            const delta = this._clock.getDelta()
            this.update()

            this._renderer.render(this._scene, this._camera)
            this._jobs.forEach((j) => j(delta))
        })
    }
}

// const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
// const cubeMat = new THREE.MeshStandardMaterial({ color: 0x50fa7b })
// const cube = new THREE.Mesh(cubeGeo, cubeMat)
// cube.castShadow = true
// cube.receiveShadow = true
// cube.position.set(5, 0.5, 5)
// // cube.position.set(3, 0.5, 3)
// this._scene.add(cube)
//
//
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
//
// _LoadWalls() {
//     const loader = new FBXLoader()
//     loader.setPath('./resources/models/Env/')
//     loader.load('ModularStoneWall_top.fbx', (f) => {
//         f.scale.setScalar(0.01)
//         f.traverse((c) => {
//             c.castShadow = true
//             c.receiveShadow = true
//         })
//         f.rotateY(Math.PI)
//         for (let i = 1; i <= 5; i += 1) {
//             const fbx = f.clone()
//             this._scene.add(fbx)
//             fbx.position.set(10, 1, 1 * 2 * i - 1)
//         }
//         f.rotateY(-Math.PI / 2)
//         for (let i = 1; i <= 5; i += 1) {
//             const fbx = f.clone()
//             this._scene.add(fbx)
//             fbx.position.set(1 * 2 * i - 1, 1, 10)
//         }
//     })
// }
