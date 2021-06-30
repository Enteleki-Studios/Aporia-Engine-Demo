import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as GLHelpers from 'GLHelpers'
import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'

import System from 'ECS/System'

export class Renderer extends System {
    constructor({ canvasId, dimensions }) {
        super([
            'light',
            'plane',
            'model',
            'position',
            'animation',
        ])

        this._dimensions = dimensions

        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.getElementById(canvasId),
        })
        this._renderer.outputEncoding = THREE.sRGBEncoding
        // this._renderer.gammaFactor = 2.2
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

        this._jobs = []
        this._models = new Map()
        this._animations = new Map()

        // Debug stuff
        this._onAddAxes()
        // this._onAddStats()
        this._onAddOrbitControls()
        this._onAddSkyBox()
    }

    addComponent(component) {
        switch (component.type) {
            case 'light':
                this._onAddLight(component)
                break
            case 'plane':
                this._onAddPlane(component)
                break
            case 'model':
                this._onAddModel(component)
                break
            case 'position':
                this._saveComponent(component)
                break
            case 'animation':
                this._saveComponent(component)
                break
            default:
                break
        }
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
        plane.position.copy(component.position)
        this._scene.add(plane)
    }

    _onAddModel(component) {
        const { entity, modelId } = component
        const { modelPath, texturePath, scale, animations: animationIndex } = modelDB[modelId]

        loadFBX(modelPath, texturePath).then((model) => {
            model.scale.setScalar(scale)

            this._scene.add(model)
            this._models.set(entity, model)

            if (model.animations) {
                const mixer = new THREE.AnimationMixer(model)
                const modelAnimations = {}
                model.animations.forEach((anim) => {
                    modelAnimations[animationIndex[anim.name]] = ({
                        clip: anim,
                        action: mixer.clipAction(anim),
                    })
                })
                this._animations.set(entity, modelAnimations)

                if (this._hasComponent(entity, 'animation')) {
                    this._jobs.push((delta) => mixer.update(delta))
                }
            }
        })
    }

    tick(delta) {
        this._renderer.render(this._scene, this._camera)
        this._jobs.forEach((j) => j(delta))

        this._components.forEach((component) => {
            switch (component.type) {
                case 'position':
                    if (component._needsUpdate && this._models.has(component.entity)) {
                        const model = this._models.get(component.entity)
                        model.position.copy(component.position)
                        model.quaternion.copy(component.quaternion)
                        component._needsUpdate = false
                    }
                    break
                case 'animation':
                    if (component._needsUpdate && this._animations.has(component.entity)) {
                        component._needsUpdate = false
                        const { action } = this._animations.get(component.entity)[component.state]
                        action.time = 0.0
                        action.enabled = true
                        action.setEffectiveTimeScale(1.0)
                        action.setEffectiveWeight(1.0)
                        if (component._prevState) {
                            const { action: prevAction } = this._animations.get(component.entity)[component._prevState]
                            const ratio = action.getClip().duration / prevAction.getClip().duration
                            action.time = prevAction.time * ratio
                            action.crossFadeFrom(prevAction, 0.5, true)
                        }
                        action.play()
                        component._needsUpdate = false
                    }
                    break
                default:
                    break
            }
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
