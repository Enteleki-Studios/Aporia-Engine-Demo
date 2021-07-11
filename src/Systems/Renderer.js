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

        this._onAddSkyBox()
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

    _onAddLight(component) {
        switch (component.lightType) {
            case 'DirectionalLight': {
                const light = new GLHelpers.DirectionalLight(0xFFFFFF, 1.0)
                component.resource = light
                this._scene.add(light)
                this._scene.add(light.helper)
                this._scene.add(light.shadowHelper)
                break
            }
            case 'AmbientLight': {
                const light = new THREE.AmbientLight(component.color, component.intensity)
                component.resource = light
                this._scene.add(light)
                break
            }
            default:
                break
        }
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
        component.resource = plane
        this._scene.add(plane)
    }

    _onAddModel(component) {
        const { entity, modelId } = component
        const { modelPath, texturePath, scale, animations: animationIndex } = modelDB[modelId]

        component.isLoading = true
        loadFBX(modelPath, texturePath).then((model) => {
            model.scale.setScalar(scale)

            this._scene.add(model)
            component.resource = model
            component.isLoading = false

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

                // TODO: update animations to a proper system
                // Not all models will be animated
                this._jobs.push((delta) => mixer.update(delta))
            }
        })
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
                    this._onAddModel(modelComponent)
                }
            },
        )

        this.ECS.ComponentManager.getTuplesByQuery([LIGHT]).forEach(([lightComponent]) => {
            if (!lightComponent.resource) {
                this._onAddLight(lightComponent)
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([PLANE]).forEach(([planeComponent]) => {
            if (!planeComponent.resource) {
                this._onAddPlane(planeComponent)
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
