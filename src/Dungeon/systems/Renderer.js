import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

import * as GLHelpers from 'GLHelpers'
import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'

import { LIGHT, MODEL, POSITION, CAMERA, LEVEL } from 'components/types'

import { System } from 'ECS'

const DEBUG = true

export class Renderer extends System {
    constructor({ canvas, aspect }) {
        super()

        this._renderer = new GLHelpers.Renderer({ canvas })

        this._scene = new THREE.Scene()
        this._scene.background = new THREE.Color(0x121212)
        if (!DEBUG) {
            this._scene.fog = new THREE.Fog(this._scene.background, 1, 30)
        }

        const fov = 60
        const near = 0.5
        const far = 50
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

        this._jobs = []

        if (DEBUG) {
            this._scene.add(new THREE.CameraHelper(this._camera))
            this._debugCamera = new THREE.PerspectiveCamera(fov, aspect, near, 500)
            this._debugCamera.position.set(20, 20, 20)

            this._orbitControls = null

            this._enableDebug()
        }

        // this._addSkyBox()
        this._hasWorld = false

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x2ab7ca })
        const box = new THREE.Mesh(boxGeometry, boxMaterial)
        box.receiveShadow = true
        box.castShadow = true
        box.position.set(64, 0.5, 68)
        this._scene.add(box)

        const box2Geometry = new THREE.BoxGeometry(1, 2, 1)
        const box2Material = new THREE.MeshStandardMaterial({ color: 0x2ab7ca })
        const box2 = new THREE.Mesh(box2Geometry, box2Material)
        box2.receiveShadow = true
        box2.castShadow = true
        box2.position.set(62, 1, 68)
        this._scene.add(box2)

        this._scene.add(new THREE.AxesHelper(1))
    }

    _enableDebug() {
        // FPS counter
        // const s = new Stats()
        // document.body.appendChild(s.dom)
        // this._jobs.push(() => s.update())

        // Origin axes
        this._scene.add(new THREE.AxesHelper(1))

        // Mouse camera controls
        this._orbitControls = new OrbitControls(
            this._debugCamera,
            this._renderer.domElement,
        )
        // controls.minDistance = 3
        // controls.maxDistance = 50
        // controls.target.set(0, 0, -100)
        this._orbitControls.update()
    }

    _addWorld(levelComponent) {
        const wallGeometries = []
        const { tiles } = levelComponent

        const createWall = (x, y) => {
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
        this._scene.add(wallMesh)

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
        this._scene.add(floor)

        this._hasWorld = true
    }

    static createLight(lightComponent) {
        switch (lightComponent.lightType) {
            case 'DirectionalLight':
                return new GLHelpers.DirectionalLight(0xFFFFFF, 0.4)
            case 'AmbientLight':
                return new THREE.AmbientLight(lightComponent.color, lightComponent.intensity)
            default:
                throw new Error(`Unsupported light type ${lightComponent.lightType}`)
        }
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
        if (DEBUG) {
            this._renderer.render(this._scene, this._debugCamera)
        } else {
            this._renderer.render(this._scene, this._camera)
        }
        this._jobs.forEach((j) => j(delta))

        this.ECS.ComponentManager.getTuplesByQuery([MODEL, POSITION]).forEach(
            ([modelComponent, positionComponent]) => {
                if (modelComponent.resource) {
                    // Update position
                    if (positionComponent.needsUpdate) {
                        modelComponent.resource.position.copy(positionComponent.position)
                        modelComponent.resource.quaternion.copy(positionComponent.rotation)
                        modelComponent.needsUpdate = false
                    }
                } else if (!modelComponent.isLoading) {
                    modelComponent.isLoading = true
                    Renderer.createModel(modelComponent).then((resource) => {
                        modelComponent.resource = resource
                        this._scene.add(resource)
                        modelComponent.isLoading = false
                    })
                }
            },
        )

        this.ECS.ComponentManager.getTuplesByQuery([LIGHT]).forEach(([lightComponent]) => {
            if (!lightComponent.resource) {
                lightComponent.resource = Renderer.createLight(lightComponent)
                this._scene.add(lightComponent.resource)
                if (lightComponent.resource.target) {
                    this._scene.add(lightComponent.resource.target)
                }
                if (DEBUG) {
                    if (lightComponent.resource.helper) {
                        this._scene.add(lightComponent.resource.helper)
                    }
                    if (lightComponent.resource.shadowHelper) {
                        this._scene.add(lightComponent.resource.shadowHelper)
                    }
                }
            } else if (lightComponent.needsUpdate) {
                if (lightComponent.lightType === 'DirectionalLight') {
                    lightComponent.resource.position.copy(lightComponent.position)
                    lightComponent.resource.target.position.copy(lightComponent.target)
                    lightComponent.needsUpdate = false
                }
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([CAMERA]).forEach(([cameraComponent]) => {
            if (cameraComponent.needsUpdate) {
                this._camera.position.copy(cameraComponent.position)
                this._camera.lookAt(cameraComponent.lookAt)
                cameraComponent.needsUpdate = false

                if (DEBUG) {
                    this._orbitControls.target.copy(cameraComponent.lookAt)
                    this._orbitControls.update()
                }
            }
        })

        if (!this._hasWorld) {
            const [levelComponent] = this.ECS.ComponentManager.getTuplesByQuery([LEVEL])[0]
            this._addWorld(levelComponent)
        }
    }
}
