import {
    type AnimationAction,
    AnimationMixer,
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    CameraHelper,
    Group,
    type IUniform,
    Mesh,
    MeshStandardMaterial,
    OrthographicCamera,
    PerspectiveCamera,
    PlaneGeometry,
    RepeatWrapping,
    SkeletonHelper,
    SphereGeometry,
    TextureLoader,
    Vector3,
} from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Water } from 'three/addons/objects/Water.js'

import {
    type DefaultResources,
    ObjectStore,
    type Plugin,
    type WorldWithPlugin,
} from '@core'

import { generateWedgeMeshData, transpose1D } from '@core/utils'

import { type EntityId } from '@pluginEntities'

import { AxesHelper } from './meshes/axesHelper'
import { InfiniteGrid } from './meshes/infiniteGrid'
import {
    floatingLabelQuery,
    geometryQuery,
    gltfQuery,
    perspectiveCameraQuery,
} from './queries'
import { Renderer } from './renderer'
import { animationSystem } from './systems/animations'
import { syncTransforms } from './systems/syncTransform'
import { CheckeredTexture } from './textures/checkered'
import { HelperStore } from './utils/helperStore'
import { isThreeMesh } from './utils/three'

type ThreeOutput = {
    three: {
        renderer: Renderer
        objectStore: ObjectStore<EntityId, Group>
        cameraStore: Map<EntityId, PerspectiveCamera | OrthographicCamera>
        animationStore: Map<
            EntityId,
            {
                mixer: AnimationMixer
                actions: Record<string, AnimationAction | undefined>
            }
        >
        helperStore: HelperStore
        gltfLoader: GLTFLoader
        water: Water
    }
}

export type PluginThree = ReturnType<typeof pluginThree>
export type ThreeWorld = WorldWithPlugin<PluginThree>

// TODO: Move loaders to resources
const loader = new TextureLoader()
const fontLoader = new FontLoader()

export const pluginThree = (): Plugin<ThreeOutput, DefaultResources> => ({
    createResources: () => {
        const renderer = new Renderer()
        renderer.setSize(1920, 1080)
        renderer.renderer.setClearColor('#888888')

        const gltfLoader = new GLTFLoader()

        const objectStore = new ObjectStore((id: string) => {
            const group = new Group()
            group.name = id
            return group
        })

        const helperStore = new HelperStore(renderer.scene)

        helperStore.addHelper('axes', new AxesHelper(3))
        helperStore.addHelper('grid', new InfiniteGrid())

        const sun = [0, 0, 0] // TODO: Get real sun position

        // Water
        const waterGeometry = new PlaneGeometry(85, 85)
        const water = new Water(waterGeometry, {
            alpha: 0.65,
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: loader.load('textures/waternormals.jpg', (texture) => {
                texture.wrapS = texture.wrapT = RepeatWrapping
            }),
            sunDirection: new Vector3().fromArray(sun).normalize(),
            sunColor: 0xffffff,
            waterColor: 0x0088cc,
            distortionScale: 3.7,
            fog: !!renderer.scene.fog,
        })
        water.receiveShadow = true
        water.rotation.x = -Math.PI / 2
        water.position.y = 0.8
        water.position.x = -50
        water.position.z = 50
        water.material.transparent = true
        renderer.scene.add(water)

        return {
            three: {
                renderer,
                objectStore,
                animationStore: new Map(),
                cameraStore: new Map(),
                helperStore,
                gltfLoader,
                water,
            },
        }
    },
    init: (world) => {
        world.entities.addQueryEffect(
            geometryQuery,
            ([[geometryDef, transform], entity]) => {
                const { objectStore, renderer } = world.three

                const defaultTexture = new CheckeredTexture()

                // TODO: Use a function instead of mutation
                let geometry
                let material = new MeshStandardMaterial({
                    color: '#ffffff',
                    map: defaultTexture,
                    // side: 2,
                    // flatShading: true,
                })
                switch (geometryDef.type) {
                    case 'ball': {
                        geometry = new SphereGeometry(geometryDef.radius)

                        // const texture = loader.load('/textures/rock.png')
                        // texture.wrapS = RepeatWrapping
                        // texture.wrapT = RepeatWrapping
                        // texture.repeat.set(2, 2)

                        // material = new MeshStandardMaterial({
                        //     map: texture,
                        // })
                        break
                    }
                    case 'box':
                        geometry = new BoxGeometry(
                            geometryDef.halfWidth * 2,
                            geometryDef.halfHeight * 2,
                            geometryDef.halfDepth * 2,
                        )
                        break
                    // case 'capsule': {
                    //     geometry = new CapsuleGeometry(
                    //         geometryDef.radius,
                    //         geometryDef.halfHeight * 2,
                    //     )
                    //     break
                    // }
                    case 'heightfield': {
                        const { ncols, nrows, heights, scale } = geometryDef
                        geometry = new PlaneGeometry(scale[0], scale[2], ncols, nrows)

                        geometry.rotateX(-Math.PI / 2)

                        const positions = geometry.getAttribute('position')

                        // Need +1 here because the heightfield ncols and nrows
                        // are the segments and not the vertices
                        const tHeights = transpose1D(heights, ncols + 1, nrows + 1)
                        tHeights.forEach((height, i) => {
                            positions.setY(i, height * scale[1])
                        })

                        positions.needsUpdate = true
                        geometry.computeVertexNormals()

                        const texture = loader.load('/textures/grass/Grass_02.png')
                        texture.wrapS = RepeatWrapping
                        texture.wrapT = RepeatWrapping
                        texture.repeat.set(ncols * 4, nrows * 4)

                        // const maxAnisotropy = renderer.renderer.capabilities.getMaxAnisotropy()
                        // texture.anisotropy = maxAnisotropy

                        const normalsTexture = loader.load(
                            '/textures/grass/Grass_02_Nrm.png',
                        )
                        normalsTexture.wrapS = RepeatWrapping
                        normalsTexture.wrapT = RepeatWrapping
                        normalsTexture.repeat.set(ncols * 4, nrows * 4)

                        material = new MeshStandardMaterial({
                            map: texture,
                            normalMap: normalsTexture,
                        })
                        break
                    }
                    case 'wedge': {
                        const { vertices, indices, uvs } =
                            generateWedgeMeshData(geometryDef)

                        const indexedGeometry = new BufferGeometry()
                        indexedGeometry.setAttribute(
                            'position',
                            new BufferAttribute(vertices, 3),
                        )
                        indexedGeometry.setIndex(new BufferAttribute(indices, 1))
                        indexedGeometry.setAttribute('uv', new BufferAttribute(uvs, 2))
                        geometry = indexedGeometry.toNonIndexed()
                        geometry.computeVertexNormals()

                        break
                    }
                }

                const mesh = new Mesh(geometry, material)

                mesh.castShadow = true
                mesh.receiveShadow = true

                const [group, isCreated] = objectStore.getOrCreate(entity.id)
                group.add(mesh)

                if (isCreated) {
                    group.position.fromArray(transform.position)
                    group.quaternion.fromArray(transform.rotation)

                    renderer.scene.add(group)
                }
            },
        )

        world.entities.addQueryEffect(
            gltfQuery,
            ([[gltfComponent, transform], entity]) => {
                const { objectStore, renderer, gltfLoader, animationStore, helperStore } =
                    world.three
                const [group, isCreated] = objectStore.getOrCreate(entity.id)

                if (isCreated) {
                    group.position.fromArray(transform.position)
                    group.quaternion.fromArray(transform.rotation)

                    renderer.scene.add(group)
                }

                gltfLoader.load(gltfComponent.path, (gltf) => {
                    void (async () => {
                        const { animations, scene } = gltf

                        scene.traverse((child) => {
                            if (isThreeMesh(child)) {
                                child.castShadow = true
                                child.receiveShadow = true
                            }
                        })

                        if (renderer.camera) {
                            await renderer.renderer.compileAsync(
                                scene,
                                renderer.camera,
                                renderer.scene,
                            )
                        }

                        group.add(scene)

                        // TODO: This offset must be derived from a collider definition
                        scene.position.y = -0.9

                        if (animations.length) {
                            const mixer = new AnimationMixer(scene)
                            const actions = animations.reduce<
                                Record<string, AnimationAction | undefined>
                            >((acc, anim) => {
                                acc[anim.name] = mixer.clipAction(anim)
                                return acc
                            }, {})

                            animationStore.set(entity.id, {
                                mixer,
                                actions,
                            })

                            helperStore.addHelper('skeleton', new SkeletonHelper(scene))
                        }
                    })()
                })
            },
        )

        world.entities.addQueryEffect(floatingLabelQuery, ([[label], entity]) => {
            const { objectStore } = world.three
            const [group, _isCreated] = objectStore.getOrCreate(entity.id)
            // TODO: position the group if created

            const { text, size, color, offset, depth } = label
            fontLoader.load('/fonts/droid_sans_regular.typeface.json', (font) => {
                const textGeo = new TextGeometry(text, {
                    font: font,
                    size,
                    depth,

                    // curveSegments: curveSegments,
                    // bevelThickness: bevelThickness,
                    // bevelSize: bevelSize,
                    // bevelEnabled: bevelEnabled
                })

                textGeo.computeBoundingBox()
                const boundingBox = textGeo.boundingBox

                if (boundingBox) {
                    const centerOffset = -0.5 * (boundingBox.max.x - boundingBox.min.x)

                    const material = new MeshStandardMaterial({ color })

                    const textMesh = new Mesh(textGeo, material)

                    textMesh.position.x = centerOffset + offset[0]
                    textMesh.position.y = offset[1]
                    textMesh.position.z = offset[2]

                    textMesh.rotation.x = 0
                    textMesh.rotation.y = Math.PI * 2

                    group.add(textMesh)
                }
            })
        })

        world.entities.addQueryEffect(
            perspectiveCameraQuery,
            ([[cameraDef, transform], entity]) => {
                const camera = new PerspectiveCamera(
                    cameraDef.fov,
                    cameraDef.aspect,
                    cameraDef.near,
                    cameraDef.far,
                )

                camera.position.fromArray(transform.position)
                camera.quaternion.fromArray(transform.rotation)

                world.three.cameraStore.set(entity.id, camera)
                world.three.helperStore.addHelper('camera', new CameraHelper(camera))

                const { renderer } = world.three
                renderer.setMainCamera(camera)
            },
        )

        world.runtime.addSystem(syncTransforms)
        world.runtime.addSystem(animationSystem)

        world.runtime.addSystem(() => {
            world.three.renderer.render()
        })

        // TODO: Temp water shader update
        world.runtime.addSystem(() => {
            const { three } = world

            const waterTime: IUniform<number> | undefined =
                three.water.material.uniforms['time']
            if (waterTime) {
                waterTime.value += world.clock.delta * 0.25
            }
        })
    },
})
