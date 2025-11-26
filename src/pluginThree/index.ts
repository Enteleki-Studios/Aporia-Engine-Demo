import {
    AmbientLight,
    type AnimationAction,
    AnimationMixer,
    BoxGeometry,
    // CapsuleGeometry,
    DirectionalLight,
    DirectionalLightHelper,
    Group,
    type IUniform,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    SkeletonHelper,
    SphereGeometry,
    TextureLoader,
    Vector3,
    CameraHelper,
    WebGLCapabilities,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Water } from 'three/addons/objects/Water.js'

import {
    type DefaultResources,
    ObjectStore,
    type Plugin,
    type WorldWithPlugin,
} from '@core'

import { transpose1D } from '@core/utils'

import { type EntityId } from '@pluginEntities'

import { AxesHelper } from './axesHelper'
import { InfiniteGrid } from './infiniteGrid'
import { geometryQuery, gltfQuery } from './queries'
import { Renderer } from './renderer'
import { isThreeMesh } from './utils'
import { syncTransforms } from './systems/syncTransform'
import { animationSystem } from './systems/animations'

export { DefaultCube } from './defaultCube'
export { AxesHelper } from './axesHelper'
export { CustomGridTexture } from './customGridTexture'
export { DefaultGrid } from './defaultGrid'
export * from './components'

type ThreeOutput = {
    three: {
        renderer: Renderer
        objectStore: ObjectStore<EntityId, Group>
        animationStore: Map<
            EntityId,
            {
                mixer: AnimationMixer
                actions: Record<string, AnimationAction | undefined>
            }
        >
        gltfLoader: GLTFLoader
        water: Water
    }
}

export type PluginThree = ReturnType<typeof pluginThree>
export type ThreeWorld = WorldWithPlugin<PluginThree>

// TODO: Move loader to resources
const loader = new TextureLoader()

export const pluginThree = (): Plugin<ThreeOutput, DefaultResources> => ({
    createResources: () => {
        const renderer = new Renderer()

        const objectStore = new ObjectStore((id: string) => {
            const group = new Group()
            group.name = id
            return group
        })

        // renderer.setSize(1280, 720)
        renderer.setSize(1920, 1080)

        renderer.renderer.setClearColor('#888888')

        renderer.scene.add(new AxesHelper(3))
        renderer.scene.add(new InfiniteGrid())

        // renderer.scene.add(new CameraHelper(renderer.camera))

        const sky = new Sky()
        sky.scale.setScalar(1000)
        renderer.scene.add(sky)

        // sun position
        const sun = new Vector3()
        const inclination = 0.7 // elevation (0–1)
        const azimuth = 0.2 // east/west (0–1)

        const theta = Math.PI * (inclination - 0.5)
        const phi = 2 * Math.PI * (azimuth - 0.5)

        sun.x = Math.cos(phi)
        sun.y = Math.sin(theta)
        sun.z = Math.sin(phi)

        // Sky shader uniforms
        type SkyShaderUniforms = {
            turbidity: { value: number }
            rayleigh: { value: number }
            mieCoefficient: { value: number }
            mieDirectionalG: { value: number }
            sunPosition: { value: Vector3 }
            up: { value: Vector3 }
        }

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Three.js doesn't provide the type
        const skyUniforms = sky.material.uniforms as SkyShaderUniforms
        skyUniforms.turbidity.value = 5 // Higher = hazier
        skyUniforms.rayleigh.value = 0.5 // Lower = bluer
        skyUniforms.mieCoefficient.value = 0.003 // White haze
        skyUniforms.mieDirectionalG.value = 0.6 // Sun glow sharpness
        skyUniforms.sunPosition.value.copy(sun)

        renderer.scene.add(new AmbientLight(0xffffff, inclination/10))
        const light = new DirectionalLight(0xffffff, inclination)
        light.position.copy(sun.clone().multiplyScalar(10))
        light.castShadow = true
        renderer.scene.add(light)

        renderer.scene.add(new DirectionalLightHelper(light))
        renderer.scene.add(new CameraHelper(light.shadow.camera))

        // const waterGeometry = new PlaneGeometry(150, 100)
        const waterGeometry = new PlaneGeometry(1500, 1000)
        const water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: loader.load('textures/waternormals.jpg', (texture) => {
                texture.wrapS = texture.wrapT = RepeatWrapping
            }),
            sunDirection: new Vector3().copy(sun).normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: !!renderer.scene.fog,
        })
        water.rotation.x = -Math.PI / 2
        water.position.y = -0.1
        water.position.x = 0
        renderer.scene.add(water)

        // renderer.scene.overrideMaterial = new MeshBasicMaterial({ wireframe: true, color: '#0089cc' })

        const gltfLoader = new GLTFLoader()

        return {
            three: {
                renderer,
                objectStore,
                animationStore: new Map(),
                gltfLoader,
                water,
            },
        }
    },
    init: (world) => {
        world.resources.entities.addQueryObserver(
            geometryQuery,
            ([[geometryDef, transform], entity]) => {
                const { objectStore, renderer } = world.resources.three

                const defaultTexture = loader.load('/textures/checkered.jpg')

                // TODO: Use a function instead of mutation
                let geometry
                let material = new MeshStandardMaterial({
                    color: '#ffffff',
                    // side: 2,
                    // flatShading: true,
                    map: defaultTexture,
                })
                switch (geometryDef.type) {
                    case 'ball': {
                        geometry = new SphereGeometry(geometryDef.radius)

                        const texture = loader.load('/textures/rock.png')
                        texture.wrapS = RepeatWrapping
                        texture.wrapT = RepeatWrapping
                        texture.repeat.set(2, 2)

                        material = new MeshStandardMaterial({
                            map: texture,
                        })
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
                        texture.repeat.set(ncols*4, nrows*4)

                        // const maxAnisotropy = renderer.renderer.capabilities.getMaxAnisotropy()
                        // texture.anisotropy = maxAnisotropy

                        const normalsTexture = loader.load('/textures/grass/Grass_02_Nrm.png')
                        normalsTexture.wrapS = RepeatWrapping
                        normalsTexture.wrapT = RepeatWrapping
                        normalsTexture.repeat.set(ncols*4, nrows*4)

                        material = new MeshStandardMaterial({
                            map: texture,
                            normalMap: normalsTexture,
                        })
                        break
                    }
                }

                const mesh = new Mesh(geometry, material)

                mesh.castShadow = true
                mesh.receiveShadow = true

                const [group, isCreated] = objectStore.getOrCreate(entity.id)
                group.add(mesh)

                if (isCreated) {
                    // TODO: Apply full transform
                    group.position.fromArray(transform.position)
                    renderer.scene.add(group)
                }
            },
        )

        world.resources.entities.addQueryObserver(
            gltfQuery,
            ([[gltfComponent, transform], entity]) => {
                const { objectStore, renderer, gltfLoader, animationStore } =
                    world.resources.three
                const [group, isCreated] = objectStore.getOrCreate(entity.id)

                if (isCreated) {
                    // TODO: Apply full transform when group is added to scene
                    group.position.fromArray(transform.position)
                    renderer.scene.add(group)
                }

                gltfLoader.load(gltfComponent.path, (gltf) => {
                    const { animations, scene } = gltf

                    scene.traverse((child) => {
                        if (isThreeMesh(child)) {
                            child.castShadow = true
                        }
                    })

                    group.add(scene)

                    const skeleton = new SkeletonHelper(scene)
                    skeleton.visible = true
                    renderer.scene.add(skeleton)

                    // TODO: This offset must be derived from a collider definition
                    scene.position.y = -0.9

                    const mixer = new AnimationMixer(scene)
                    const actions = animations.reduce<
                        Record<string, AnimationAction | undefined>
                    >((acc, anim) => {
                        acc[anim.name] = mixer.clipAction(anim)
                        return acc
                    }, {})

                    // console.debug(actions)

                    animationStore.set(entity.id, {
                        mixer,
                        actions,
                    })
                })
            },
        )

        world.addSystem(syncTransforms)
        world.addSystem(animationSystem)

        // TODO: Temp water shader update
        world.addSystem(() => {
            const { three } = world.resources

            three.renderer.render()

            const waterTime: IUniform<number> | undefined =
                three.water.material.uniforms['time']
            if (waterTime) {
                waterTime.value += world.clock.delta * 0.5
            }
        })
    },
})
