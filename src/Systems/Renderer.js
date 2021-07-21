import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils'

import * as GLHelpers from 'GLHelpers'
import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'
import { LIGHT, PLANE, MODEL, POSITION, ANIMATION, CAMERA } from 'Components/types'

import System from 'ECS/System'

const DEBUG = false

export class Renderer extends System {
    constructor({ canvas, aspect }) {
        super()

        this._renderer = new GLHelpers.Renderer({ canvas })

        this._scene = new THREE.Scene()
        // this._scene.background = new THREE.Color(0xbd93f9)
        this._scene.background = new THREE.Color(0x121212)
        if (!DEBUG) {
            this._scene.fog = new THREE.Fog(this._scene.background, 1, 100)
        }

        const fov = 60
        const near = 1.0
        const far = 50
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

        this._jobs = []
        this._animations = new Map()

        if (DEBUG) {
            this._scene.add(new THREE.CameraHelper(this._camera))
            this._debugCamera = new THREE.PerspectiveCamera(fov, aspect, near, 500)
            this._debugCamera.position.set(20, 20, 20)

            this._orbitControls = null

            this._enableDebug()
        }

        // this._addSkyBox()
        this._addShaderWorld()
        this._addShaderWorld2()
    }

    _enableDebug() {
        // FPS counter
        const s = new Stats()
        document.body.appendChild(s.dom)
        this._jobs.push(() => s.update())

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

    _addShaderWorld() {
        const wallGeometries = []
        const localMap = window.mapArray

        const createWall = (x, y) => {
            const b = new THREE.BoxBufferGeometry(1, 3, 1)
            const mat4 = new THREE.Matrix4()
            mat4.makeTranslation(y, 1.5, x)
            b.applyMatrix4(mat4)
            return b
        }
        const mapWidth = 256
        const mapHeight = 256
        for (let x = 0; x < mapWidth; x += 1) {
            for (let y = 0; y < mapHeight; y += 1) {
                const index = y * mapWidth + x
                const isFloor = !localMap[index]
                if (isFloor) {
                    if (localMap[index - mapWidth]) {
                        wallGeometries.push(createWall(x, y - 1))
                    }
                    if (localMap[index + mapWidth]) {
                        wallGeometries.push(createWall(x, y + 1))
                    }
                    if (localMap[index - 1]) {
                        wallGeometries.push(createWall(x - 1, y))
                    }
                    if (localMap[index + 1]) {
                        wallGeometries.push(createWall(x + 1, y))
                    }
                }
            }
        }

        const mergedWallGeometries = BufferGeometryUtils.mergeBufferGeometries(wallGeometries, false)

        const wallTexture = new THREE.TextureLoader().load('/resources/textures/wall.jpg')
        wallTexture.wrapS = THREE.RepeatWrapping
        wallTexture.wrapT = THREE.RepeatWrapping
        wallTexture.repeat.x = 1
        wallTexture.repeat.y = 3
        const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture })
        wallMaterial.castShadow = false
        wallMaterial.receiveShadow = true
        const wallMesh = new THREE.Mesh(mergedWallGeometries, wallMaterial)
        this._scene.add(wallMesh)
    }

    _addShaderWorld2() {
        const mapTexture = new THREE.CanvasTexture(
            document.getElementById('mapCanvas'),
            THREE.UVMapping,
        )
        const floorTexture = new THREE.TextureLoader().load('/resources/textures/floor.png')
        floorTexture.wrapS = THREE.RepeatWrapping
        floorTexture.wrapT = THREE.RepeatWrapping
        // floorTexture.minFilter = THREE.NearestFilter

        const vertexShader = `
            uniform sampler2D mapTexture;
            uniform float tileAmt;

            varying float vAmount;
            varying vec2 vUV;

            void main()
            {
                // The "coordinates" in UV mapping representation
                vUV = uv * tileAmt;

                // The heightmap data at those coordinates
                vec4 bumpData = texture2D(mapTexture, uv);

                // height map is grayscale, so it doesn't matter if you use r, g, or b.
                vAmount = bumpData.r;

                // move the position along the normal
                // vec3 newPosition = position + normal * bumpScale * vAmount;

                // Compute the position of the vertex using a standard formula
                // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `

        const fragmentShader = `
            uniform sampler2D floorTexture;
            varying vec2 vUV;
            varying float vAmount;

            void main()
            {
                if (vAmount < 1.0) {
                    gl_FragColor = texture2D(floorTexture, vUV);
                } else {
                    gl_FragColor = vec4(0, 0, 0, 0);
                }
            }
        `

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(256, 256, 512, 512),
            new THREE.ShaderMaterial({
                uniforms: {
                    floorTexture: { value: floorTexture },
                    mapTexture: { value: mapTexture },
                    tileAmt: { value: 64.0 },
                    ambientLightColor: { value: 0xffffff },
                },
                vertexShader,
                fragmentShader,
                lights: false,
                fog: false,
                transparent: true,
            }),
        )
        floor.castShadow = false
        floor.receiveShadow = true
        floor.rotation.x = -Math.PI / 2
        floor.position.set(128, 0, 128)

        this._scene.add(floor)
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
        const texture = new THREE.TextureLoader().load('/resources/textures/floor.png')
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        const aspect = planeComponent.width / planeComponent.height
        const tileSize = 20
        texture.repeat.x = tileSize * aspect
        texture.repeat.y = tileSize
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(planeComponent.width, planeComponent.height),
            new THREE.MeshStandardMaterial({
                map: texture,
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
        if (DEBUG) {
            this._renderer.render(this._scene, this._debugCamera)
        } else {
            this._renderer.render(this._scene, this._camera)
        }
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

        this.ECS.ComponentManager.getTuplesByQuery([PLANE]).forEach(([planeComponent]) => {
            if (!planeComponent.resource) {
                planeComponent.resource = Renderer.createPlane(planeComponent)
                this._scene.add(planeComponent.resource)
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
