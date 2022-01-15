import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

import { System } from 'ECS'

import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'

import { AMBIENT_LIGHT, DIRECTIONAL_LIGHT, MODEL, POSITION, CAMERA, LEVEL } from 'components/types'
import type {
    AmbientLightComponent,
    DirectionalLightComponent,
    CameraComponent,
    LevelComponent,
    ModelComponent,
    PositionComponent,
} from 'components'

import * as GLHelpers from './GLHelpers'

const DEBUG = false

export class Renderer extends System {
    #renderer
    #scene
    #camera
    #jobs: Array<(delta: number) => void>
    #hasWorld
    #debugCamera!: THREE.PerspectiveCamera
    #orbitControls?: OrbitControls

    constructor({ canvas, aspect }: { canvas: HTMLCanvasElement, aspect: number }) {
        super()

        this.#renderer = new THREE.WebGLRenderer({ canvas })
        this.#renderer.outputEncoding = THREE.sRGBEncoding
        this.#renderer.shadowMap.enabled = true
        this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.#renderer.setPixelRatio(window.devicePixelRatio)

        this.#scene = new THREE.Scene()
        this.#scene.background = new THREE.Color(0x121212)
        if (!DEBUG) {
            this.#scene.fog = new THREE.Fog(this.#scene.background, 1, 30)
        }

        const fov = 60
        const near = 0.5
        const far = 50
        this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

        this.#jobs = []

        if (DEBUG) {
            this.#scene.add(new THREE.CameraHelper(this.#camera))
            this.#debugCamera = new THREE.PerspectiveCamera(fov, aspect, near, 500)
            this.#debugCamera.position.set(20, 20, 20)

            this.#enableDebug()
        }

        this.#hasWorld = false

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xca27ca })
        const box = new THREE.Mesh(boxGeometry, boxMaterial)
        box.receiveShadow = true
        box.castShadow = true
        box.position.set(64, 0.5, 68)
        this.#scene.add(box)

        const box2Geometry = new THREE.BoxGeometry(1, 2, 1)
        const box2Material = new THREE.MeshStandardMaterial({ color: 0x2ab7ca })
        const box2 = new THREE.Mesh(box2Geometry, box2Material)
        box2.receiveShadow = true
        box2.castShadow = true
        box2.position.set(62, 1, 68)
        this.#scene.add(box2)
    }

    #enableDebug() {
        // Origin axes
        this.#scene.add(new THREE.AxesHelper(1))

        // Mouse camera controls
        this.#orbitControls = new OrbitControls(
            this.#debugCamera,
            this.#renderer.domElement,
        )
        // controls.minDistance = 3
        // controls.maxDistance = 50
        // controls.target.set(0, 0, -100)
        this.#orbitControls.update()
    }

    #addWorld(levelComponent: LevelComponent) {
        const wallGeometries = []
        const { tiles } = levelComponent

        const createWall = (x: number, y: number) => {
            const b = new THREE.BoxBufferGeometry(1, 4, 1)
            const mat4 = new THREE.Matrix4()
            mat4.makeTranslation(x, 2, y)
            b.applyMatrix4(mat4)
            return b
        }
        for (let x = 0, maxX = tiles.length; x < maxX; x += 1) {
            for (let y = 0, maxY = tiles[0].length; y < maxY; y += 1) {
                const tile = tiles[x][y]
                if (tile[1]) {
                    wallGeometries.push(createWall(x, y))
                }
            }
        }

        const mergedWallGeometries = mergeBufferGeometries(wallGeometries, false)

        const wallTexture = new THREE.TextureLoader().load('/resources/textures/wall.jpg')
        wallTexture.wrapS = THREE.RepeatWrapping
        wallTexture.wrapT = THREE.RepeatWrapping
        wallTexture.repeat.set(1, 3)
        const wallMaterial = new THREE.MeshStandardMaterial({
            map: wallTexture,
            flatShading: true,
            side: THREE.FrontSide,
        })
        const wallMesh = new THREE.Mesh(mergedWallGeometries, wallMaterial)
        wallMesh.receiveShadow = true
        wallMesh.castShadow = true
        this.#scene.add(wallMesh)

        const floorTexture = new THREE.TextureLoader().load('/resources/textures/floor.png')
        floorTexture.wrapS = THREE.RepeatWrapping
        floorTexture.wrapT = THREE.RepeatWrapping
        // floorTexture.minFilter = THREE.NearestFilter

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(128, 128),
            new THREE.MeshStandardMaterial({
                map: floorTexture,
            }),
        )
        floorTexture.repeat.set(32, 32)
        floor.receiveShadow = true
        floor.rotation.x = -Math.PI / 2
        floor.position.set(63.5, 0, 63.5)
        this.#scene.add(floor)

        this.#hasWorld = true
    }

    static async createModel(modelComponent: ModelComponent) {
        const { modelId } = modelComponent

        const { modelPath, texturePath, scale } = modelDB[modelId]

        const model = await loadFBX(modelPath, texturePath)
        model.scale.setScalar(scale)

        return model
    }

    tick(delta: number) {
        if (DEBUG) {
            this.#renderer.render(this.#scene, this.#debugCamera)
        } else {
            this.#renderer.render(this.#scene, this.#camera)
        }

        this.#jobs.forEach((j) => j(delta))

        this.ECS.ComponentManager.getTuplesByQuery([MODEL, POSITION]).forEach((tuple) => {
            const [modelComponent, positionComponent] = tuple as [ModelComponent, PositionComponent]
            if (modelComponent.resource) {
                // Update position
                if (positionComponent.needsUpdate) {
                    modelComponent.resource.position.copy(positionComponent.position)
                    modelComponent.resource.quaternion.copy(positionComponent.rotation)
                    positionComponent.needsUpdate = false
                }
            } else if (!modelComponent.isLoading) {
                modelComponent.isLoading = true
                Renderer.createModel(modelComponent).then((resource) => {
                    modelComponent.resource = resource
                    this.#scene.add(resource)
                    modelComponent.isLoading = false
                })
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([DIRECTIONAL_LIGHT]).forEach((tuple) => {
            const [directionalLightComponent] = tuple as [DirectionalLightComponent]
            if (!directionalLightComponent.resource) {
                directionalLightComponent.resource = new GLHelpers.DirectionalLight(0xFFFFFF, 0.4)
                this.#scene.add(directionalLightComponent.resource)
                if (directionalLightComponent.resource.target) {
                    this.#scene.add(directionalLightComponent.resource.target)
                }
                if (DEBUG) {
                    if (directionalLightComponent.resource.helper) {
                        this.#scene.add(directionalLightComponent.resource.helper)
                    }
                    if (directionalLightComponent.resource.shadowHelper) {
                        this.#scene.add(directionalLightComponent.resource.shadowHelper)
                    }
                }
            } else if (directionalLightComponent.needsUpdate) {
                directionalLightComponent.resource.position.copy(directionalLightComponent.position)
                directionalLightComponent.resource.target.position.copy(directionalLightComponent.target)
                directionalLightComponent.needsUpdate = false
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([AMBIENT_LIGHT]).forEach((tuple) => {
            const [ambientLightComponent] = tuple as [AmbientLightComponent]
            if (!ambientLightComponent.resource) {
                const { color, intensity } = ambientLightComponent
                ambientLightComponent.resource = new THREE.AmbientLight(color, intensity)
                this.#scene.add(ambientLightComponent.resource)
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([CAMERA]).forEach((tuple) => {
            const [cameraComponent] = tuple as [CameraComponent]
            if (cameraComponent.needsUpdate) {
                this.#camera.position.copy(cameraComponent.position)
                this.#camera.lookAt(cameraComponent.lookAt)
                cameraComponent.needsUpdate = false

                if (DEBUG && this.#orbitControls) {
                    this.#orbitControls.target.copy(cameraComponent.lookAt)
                    this.#orbitControls.update()
                }
            }
        })

        if (!this.#hasWorld) {
            const [levelComponent] = this.ECS.ComponentManager.getTuplesByQuery([LEVEL])[0] as [LevelComponent]
            this.#addWorld(levelComponent)
        }
    }
}
