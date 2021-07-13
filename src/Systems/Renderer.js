import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as GLHelpers from 'GLHelpers'
import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'
import { LIGHT, PLANE, MODEL, POSITION, ANIMATION } from 'Components/types'

import System from 'ECS/System'

export class Renderer extends System {
    constructor({ canvas, aspect }) {
        super()

        this._renderer = new GLHelpers.Renderer({ canvas })

        this._scene = new THREE.Scene()
        this._scene.background = new THREE.Color(0xbd93f9)
        this._scene.fog = new THREE.Fog(this._scene.background, 1, 100)

        const fov = 60
        const near = 1.0
        const far = 500
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this._camera.position.set(5, 6, -6)

        this._jobs = []
        this._animations = new Map()

        // Debug stuff
        this._enableDebug()

        this._addSkyBox()
    }

    _enableDebug() {
        // FPS counter
        const s = new Stats()
        document.body.appendChild(s.dom)
        this._jobs.push(() => s.update())

        // Origin axes
        this._scene.add(new THREE.AxesHelper(1))

        // Mouse camera controls
        const controls = new OrbitControls(
            this._camera,
            this._renderer.domElement,
        )
        controls.minDistance = 3
        controls.maxDistance = 50
        controls.target.set(5, 2, 5)
        controls.update()
    }

    static createLight(lightComponent) {
        switch (lightComponent.lightType) {
            case 'DirectionalLight':
                return new GLHelpers.DirectionalLight(0xFFFFFF, 1.0)
            case 'AmbientLight':
                return new THREE.AmbientLight(lightComponent.color, lightComponent.intensity)
            default:
                throw new Error(`Unsupported light type ${lightComponent.lightType}`)
        }
    }

    static createPlane(planeComponent) {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(planeComponent.width, planeComponent.height),
            new THREE.MeshStandardMaterial({
                color: planeComponent.color,
            }),
        )
        plane.castShadow = false
        plane.receiveShadow = true
        plane.rotation.x = -Math.PI / 2
        plane.position.copy(planeComponent.position)
        return plane
    }

    static async createModel(modelComponent) {
        const { modelId } = modelComponent
        const { modelPath, texturePath, scale } = modelDB[modelId]

        const model = await loadFBX(modelPath, texturePath)
        model.scale.setScalar(scale)
        return model
    }

    _addSkyBox() {
        this._scene.add(new GLHelpers.SkyBox())
    }

    tick(delta) {
        this._renderer.render(this._scene, this._camera)
        this._jobs.forEach((j) => j(delta))

        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, MODEL, POSITION]).forEach(
            ([animationComponent, modelComponent, positionComponent]) => {
                if (modelComponent.resource) {
                    // Update position
                    if (positionComponent.needsUpdate) {
                        modelComponent.resource.position.copy(positionComponent.position)
                        modelComponent.resource.quaternion.copy(positionComponent.quaternion)
                        modelComponent.needsUpdate = false
                    }

                    // Update animation
                    if (animationComponent.needsUpdate) {
                        const { action } = this._animations.get(animationComponent.entity)[animationComponent.state]
                        action.time = 0.0
                        action.enabled = true
                        action.setEffectiveTimeScale(1.0)
                        action.setEffectiveWeight(1.0)
                        if (animationComponent.prevState) {
                            const animations = this._animations.get(animationComponent.entity)
                            const { action: prevAction } = animations[animationComponent.prevState]
                            const ratio = action.getClip().duration / prevAction.getClip().duration
                            action.time = prevAction.time * ratio
                            action.crossFadeFrom(prevAction, 0.5, true)
                        }
                        action.play()
                        animationComponent.needsUpdate = false
                    }
                } else if (!modelComponent.isLoading) {
                    modelComponent.isLoading = true
                    Renderer.createModel(modelComponent).then((resource) => {
                        console.debug(resource)
                        modelComponent.resource = resource
                        this._scene.add(resource)
                        if (resource.animations) {
                            const { animations: animationIndex } = modelDB[modelComponent.modelId]
                            const mixer = new THREE.AnimationMixer(resource)
                            const modelAnimations = {}
                            resource.animations.forEach((anim) => {
                                modelAnimations[animationIndex[anim.name]] = ({
                                    clip: anim,
                                    action: mixer.clipAction(anim),
                                })
                            })
                            this._animations.set(modelComponent.entity, modelAnimations)

                            // TODO: update animations to a proper system
                            // Not all models will be animated
                            this._jobs.push((d) => mixer.update(d))
                        }
                        modelComponent.isLoading = false
                    })
                }
            },
        )

        this.ECS.ComponentManager.getTuplesByQuery([LIGHT]).forEach(([lightComponent]) => {
            if (!lightComponent.resource) {
                lightComponent.resource = Renderer.createLight(lightComponent)
                this._scene.add(lightComponent.resource)
                if (lightComponent.resource.helper) {
                    this._scene.add(lightComponent.resource.helper)
                }
                if (lightComponent.resource.shadowHelper) {
                    this._scene.add(lightComponent.resource.shadowHelper)
                }
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([PLANE]).forEach(([planeComponent]) => {
            if (!planeComponent.resource) {
                planeComponent.resource = Renderer.createPlane(planeComponent)
                this._scene.add(planeComponent.resource)
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
