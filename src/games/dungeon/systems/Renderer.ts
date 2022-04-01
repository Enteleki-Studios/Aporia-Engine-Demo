import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

import {
    DefaultGrid,
    DirectionalLight,
    DirectionalLightComponent,
    ModelComponent,
    TextSprite,
    DefaultCube,
    HUDLayer,
    DebugInfoTexture,
    ComponentManager,
    AmbientLightComponent,
} from 'gengine'

import loadFBX from 'dungeon/utils/loadFBX'
import modelDB from 'modelDB'

import { POSITION, CAMERA, LEVEL } from 'components/types'
import type {
    CameraComponent,
    LevelComponent,
    PositionComponent,
} from 'components'
import { LineBasicMaterial } from 'three'

const DEBUG = true

export class Renderer {
    renderer
    scene
    camera
    hudLayer
    jobs: Array<(delta: number) => void>
    hasWorld
    debugCamera: THREE.PerspectiveCamera
    orbitControls?: OrbitControls
    directionalLight?: DirectionalLight

    constructor({ canvas, aspect }: { canvas: HTMLCanvasElement, aspect: number }) {
        this.jobs = []
        this.hasWorld = false

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })

        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.renderer.debug.checkShaderErrors = true
        this.renderer.autoClear = false

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x121212)
        if (!DEBUG) {
            this.scene.fog = new THREE.Fog(this.scene.background, 1, 30)
        }

        const fov = 60
        const near = 0.5
        const far = 50
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        this.debugCamera = new THREE.PerspectiveCamera(fov, aspect, near, 500)
        this.debugCamera.position.set(20, 20, 20)

        if (DEBUG) {
            this.enableDebug()
        }

        const debugTex = new DebugInfoTexture(canvas.width, canvas.height)
        this.hudLayer = new HUDLayer(canvas.width, canvas.height, debugTex)
        this.jobs.push((delta: number) => {
            debugTex.update({ delta, renderer: this.renderer })
        })

        const box1 = new DefaultCube(1, 0xca27ca)
        box1.position.set(1, 0, 8)
        const box2 = new DefaultCube(1, 2, 1, 0x2ab7ca)
        box2.position.set(-1, 0, 8)
        this.scene.add(box1, box2)
    }

    enableDebug() {
        // Origin axes
        const axes = new THREE.AxesHelper(1)
        const axesMat = axes.material as LineBasicMaterial
        axesMat.depthTest = false
        axes.renderOrder = 1
        this.scene.add(axes)

        this.scene.add(new THREE.CameraHelper(this.camera))

        // Mouse camera controls
        this.orbitControls = new OrbitControls(
            this.debugCamera,
            this.renderer.domElement,
        )
        // controls.minDistance = 3
        // controls.maxDistance = 50
        // controls.target.set(0, 0, -100)
        this.orbitControls.update()
    }

    // eslint-disable-next-line
    addWorld(levelComponent: LevelComponent) {
        // const wallGeometries = []
        // const { tiles } = levelComponent

        // const createWall = (x: number, y: number) => {
        //     const b = new THREE.BoxBufferGeometry(1, 4, 1)
        //     const mat4 = new THREE.Matrix4()
        //     mat4.makeTranslation(x, 2, y)
        //     b.applyMatrix4(mat4)
        //     return b
        // }
        // for (let x = 0, maxX = tiles.length; x < maxX; x += 1) {
        //     for (let y = 0, maxY = tiles[0].length; y < maxY; y += 1) {
        //         const tile = tiles[x][y]
        //         if (tile[1]) {
        //             wallGeometries.push(createWall(x, y))
        //         }
        //     }
        // }

        // const mergedWallGeometries = mergeBufferGeometries(wallGeometries, false)

        // const wallTexture = new THREE.TextureLoader().load('/resources/textures/wall.jpg')
        // wallTexture.wrapS = THREE.RepeatWrapping
        // wallTexture.wrapT = THREE.RepeatWrapping
        // wallTexture.repeat.set(1, 3)
        // const wallMaterial = new THREE.MeshStandardMaterial({
        //     map: wallTexture,
        //     flatShading: true,
        //     side: THREE.FrontSide,
        // })
        // const wallMesh = new THREE.Mesh(mergedWallGeometries, wallMaterial)
        // wallMesh.receiveShadow = true
        // wallMesh.castShadow = true
        // this.scene.add(wallMesh)

        const floor = new DefaultGrid(32, { text: 'Dungeon\n1m' })
        this.scene.add(floor)

        this.hasWorld = true
    }

    static async createModel(modelComponent: ModelComponent<typeof modelDB>) {
        const { modelName } = modelComponent

        const { modelPath, texturePath, scale } = modelDB[modelName]

        const model: THREE.Object3D = await loadFBX(modelPath, texturePath)
        model.scale.setScalar(scale)

        return model
    }

    tick(delta: number, componentManager: ComponentManager) {
        if (DEBUG) {
            this.renderer.render(this.scene, this.debugCamera)
        } else {
            this.renderer.render(this.scene, this.camera)
        }

        this.jobs.forEach((j) => j(delta))

        this.renderer.render(this.hudLayer.scene, this.hudLayer.camera)

        componentManager.getTuplesByQueryGeneric<[ModelComponent<typeof modelDB>, PositionComponent]>(
            ['MODEL', POSITION],
        ).forEach((tuple) => {
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
                    sprite.renderOrder = 1
                    sprite.material.depthTest = false
                    group.add(sprite)
                    // document.body.prepend(canvas)

                    const box = new THREE.Box3().setFromObject(resource)
                    sprite.position.y = box.max.y + 0.15
                    sprite.center.set(0.5, 0) // Set origin to center bottom

                    modelComponent.resource = resource
                    modelComponent.group = group

                    this.scene.add(group)
                    modelComponent.isLoading = false
                })
            }
        })

        componentManager.getTuplesByQueryGeneric<[DirectionalLightComponent]>(
            ['DIRECTIONAL_LIGHT'],
        ).forEach((tuple) => {
            const [directionalLightComponent] = tuple as [DirectionalLightComponent]
            if (!this.directionalLight) {
                this.directionalLight = new DirectionalLight(0xFFFFFF, 0.4)
                this.scene.add(this.directionalLight)
                if (this.directionalLight.target) {
                    this.scene.add(this.directionalLight.target)
                }
                if (DEBUG) {
                    if (this.directionalLight.helper) {
                        this.scene.add(this.directionalLight.helper)
                    }
                    if (this.directionalLight.shadowHelper) {
                        this.scene.add(this.directionalLight.shadowHelper)
                    }
                }
            } else if (directionalLightComponent.needsUpdate) {
                this.directionalLight.position.copy(directionalLightComponent.position)
                this.directionalLight.target.position.copy(directionalLightComponent.target)
                directionalLightComponent.needsUpdate = false
            }
        })

        componentManager.getTuplesByQuery(['AMBIENT_LIGHT']).forEach((tuple) => {
            const [ambientLightComponent] = tuple as [AmbientLightComponent]
            if (!ambientLightComponent.resource) {
                const { color, intensity } = ambientLightComponent
                ambientLightComponent.resource = new THREE.AmbientLight(color, intensity)
                this.scene.add(ambientLightComponent.resource)
            }
        })

        componentManager.getTuplesByQuery([CAMERA]).forEach((tuple) => {
            const [cameraComponent] = tuple as [CameraComponent]
            this.camera.position.copy(cameraComponent.position)
            this.camera.lookAt(cameraComponent.lookAt)

            if (DEBUG && this.orbitControls) {
                // this.orbitControls.target.copy(cameraComponent.lookAt)
                this.orbitControls.update()
            }
        })

        if (!this.hasWorld) {
            const [levelComponent] = componentManager.getTuplesByQuery([LEVEL])[0] as [LevelComponent]
            this.addWorld(levelComponent)
        }
    }
}
