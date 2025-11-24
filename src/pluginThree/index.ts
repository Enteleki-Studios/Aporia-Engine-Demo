import {
    AmbientLight,
    AnimationAction,
    AnimationMixer,
    BoxGeometry,
    CapsuleGeometry,
    DirectionalLight,
    DirectionalLightHelper,
    Group,
    IUniform,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    SkeletonHelper,
    SphereGeometry,
    TextureLoader,
    Vector3,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Water } from 'three/addons/objects/Water.js'

import { type DefaultResources, ObjectStore, type Plugin } from '@core'

import { Geometry3DComponent, Transform3DComponent } from '@core/components'
import { transpose1D } from '@core/utils'

import { createQuery } from '@pluginEntities'

import { AxesHelper } from './axesHelper'
import { GltfComponent, RenderableDynamic } from './components'
import { InfiniteGrid } from './infiniteGrid'
import { Renderer } from './renderer'
import { isThreeMesh } from './utils'

export { DefaultCube } from './defaultCube'
export { AxesHelper } from './axesHelper'
export { CustomGridTexture } from './customGridTexture'
export { DefaultGrid } from './defaultGrid'
export * from './components'

type ThreeOutput = {
    three: {
        renderer: Renderer
        objectStore: ObjectStore<string, Group>
        gltfLoader: GLTFLoader
        water: Water
    }
}

export type PluginThree = ReturnType<typeof pluginThree>

// TODO: Move loader to resources
const loader = new TextureLoader()

const dynamicRenderables = createQuery([Transform3DComponent, RenderableDynamic])

// TODO: Add renderable component checks to these queries
const geometryQuery = createQuery([Geometry3DComponent, Transform3DComponent])
const gltfQuery = createQuery([GltfComponent, Transform3DComponent])

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

        renderer.scene.add(new AmbientLight(0xffffff, 0.2))

        renderer.scene.add(new AxesHelper(3))
        renderer.scene.add(new InfiniteGrid())

        const sky = new Sky()
        sky.scale.setScalar(1000)
        renderer.scene.add(sky)

        // sun position
        const sun = new Vector3()
        const inclination = 0.9 // elevation (0–1)
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

        const light = new DirectionalLight(0xffffff, 1.0)
        light.position.copy(sun.clone().multiplyScalar(10))
        light.castShadow = true
        renderer.scene.add(light)

        const lightHelper = new DirectionalLightHelper(light)
        renderer.scene.add(lightHelper)

        const waterGeometry = new PlaneGeometry(100, 100)
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
        water.position.y = 0.01
        water.position.x = -50
        renderer.scene.add(water)

        // renderer.scene.overrideMaterial = new MeshBasicMaterial({ wireframe: true, color: '#0089cc' })

        const gltfLoader = new GLTFLoader()

        return {
            three: {
                renderer,
                objectStore,
                gltfLoader,
                water,
            },
        }
    },
    init: (runtime) => {
        runtime.resources.entities.addQueryObserver(
            geometryQuery,
            ([[geometryDef, transform], entity]) => {
                const { objectStore, renderer } = runtime.resources.three

                // TODO: Use a function instead of mutation
                let geometry
                switch (geometryDef.type) {
                    case 'ball':
                        geometry = new SphereGeometry(geometryDef.radius)
                        break
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
                        break
                    }
                }

                const map = loader.load('/textures/checkered.jpg')

                const material = new MeshStandardMaterial({
                    color: '#ffffff',
                    // side: 2,
                    map,
                })
                // material.flatShading = true

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

        runtime.resources.entities.addQueryObserver(
            gltfQuery,
            ([[gltfComponent, transform], entity]) => {
                const { objectStore, renderer, gltfLoader } = runtime.resources.three
                const [group, isCreated] = objectStore.getOrCreate(entity.id)

                if (isCreated) {
                    // TODO: Apply full transform when group is added to scene
                    group.position.fromArray(transform.position)
                    renderer.scene.add(group)
                }

                gltfLoader.load(gltfComponent.path, (gltf) => {
                    const { animations, scene } = gltf

                    console.debug(animations, scene)

                    scene.traverse((child) => {
                        if (isThreeMesh(child)) {
                            child.castShadow = true
                        }
                    })

                    group.add(scene)

                    const skeleton = new SkeletonHelper(scene)
                    skeleton.visible = true
                    renderer.scene.add(skeleton)

                    scene.position.y = -0.9

                    const mixer = new AnimationMixer(scene);
                    const idleAnimation = animations.find((a) => a.name === 'Idle_Loop')
                    if (idleAnimation) {
                        const idleAction = mixer.clipAction(idleAnimation)
                        idleAction.play()
                    }

                    const actions = animations.reduce<Record<string, AnimationAction | undefined>>((acc, anim) => {
                        acc[anim.name] = mixer.clipAction(anim)
                        return acc
                    }, {})

                    runtime.addSystem((world) => {
                        mixer.update(world.clock.delta)
                    })
                })
            },
        )

        runtime.addSystem((world) => {
            world.resources.entities
                .query(dynamicRenderables)
                .forEach(([[transform], entity]) => {
                    const group = world.resources.three.objectStore.get(entity.id)

                    if (group) {
                        group.position.fromArray(transform.position)
                        group.scale.fromArray(transform.scale)
                        if (
                            group.quaternion.x !== transform.rotation[0] ||
                                group.quaternion.y !== transform.rotation[1] ||
                                group.quaternion.z !== transform.rotation[2] ||
                                group.quaternion.w !== transform.rotation[3]
                        ) {
                            group.quaternion.fromArray(transform.rotation)
                        }
                    }
                })
        })

        runtime.addSystem((world) => {
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
