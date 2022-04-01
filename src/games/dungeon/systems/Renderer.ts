import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

import { System, TextSprite, DirectionalLight, DirectionalLightComponent, ModelComponent } from 'gengine'

import loadFBX from 'dungeon/utils/loadFBX'
import modelDB from 'modelDB'

import { AMBIENT_LIGHT, POSITION, CAMERA, LEVEL } from 'components/types'
import type {
    AmbientLightComponent,
    CameraComponent,
    LevelComponent,
    PositionComponent,
} from 'components'

const DEBUG = false

export class Renderer extends System {
    #renderer
    #scene
    #camera
    #jobs: Array<(delta: number) => void>
    #hasWorld
    #debugCamera!: THREE.PerspectiveCamera
    #orbitControls?: OrbitControls
    directionalLight?: DirectionalLight

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

    static async createModel(modelComponent: ModelComponent<typeof modelDB>) {
        const { modelName } = modelComponent

        const { modelPath, texturePath, scale } = modelDB[modelName]

        const model: THREE.Object3D = await loadFBX(modelPath, texturePath)
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

        this.ECS.ComponentManager.getTuplesByQueryGeneric<[ModelComponent<typeof modelDB>, PositionComponent]>(['MODEL', POSITION]).forEach((tuple) => {
            const [modelComponent, positionComponent] = tuple
            if (modelComponent.group) {
                // Update position
                if (positionComponent.needsUpdate) {
                    modelComponent.group.position.copy(positionComponent.position)
                    modelComponent.group.quaternion.copy(positionComponent.rotation)
                    positionComponent.needsUpdate = false
                }
            } else if (!modelComponent.isLoading) {
                modelComponent.isLoading = true
                Renderer.createModel(modelComponent).then((resource) => {
                    const group = new THREE.Group()
                    group.add(resource)

                    const tripcode = modelComponent.entityId.split('-')[0]
                    const sprite = new TextSprite(tripcode)
                    group.add(sprite)
                    // document.body.prepend(canvas)

                    const box = new THREE.Box3().setFromObject(resource)
                    sprite.position.y = box.max.y + 0.15
                    sprite.center.set(0.5, 0) // Set origin to center bottom

                    modelComponent.resource = resource
                    modelComponent.group = group

                    this.#scene.add(group)
                    modelComponent.isLoading = false
                })
            }
        })

        this.ECS.ComponentManager.getTuplesByQueryGeneric<[DirectionalLightComponent]>(['DIRECTIONAL_LIGHT']).forEach((tuple) => {
            const [directionalLightComponent] = tuple as [DirectionalLightComponent]
            if (!this.directionalLight) {
                this.directionalLight = new DirectionalLight(0xFFFFFF, 0.4)
                this.#scene.add(this.directionalLight)
                if (this.directionalLight.target) {
                    this.#scene.add(this.directionalLight.target)
                }
                if (DEBUG) {
                    if (this.directionalLight.helper) {
                        this.#scene.add(this.directionalLight.helper)
                    }
                    if (this.directionalLight.shadowHelper) {
                        this.#scene.add(this.directionalLight.shadowHelper)
                    }
                }
            } else if (directionalLightComponent.needsUpdate) {
                this.directionalLight.position.copy(directionalLightComponent.position)
                this.directionalLight.target.position.copy(directionalLightComponent.target)
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
