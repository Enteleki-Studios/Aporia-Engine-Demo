import {
    AmbientLight,
    // AxesHelper,
    BoxGeometry,
    DirectionalLight,
    GridHelper,
    Group,
    Mesh,
    MeshStandardMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    ReinhardToneMapping,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { DefaultEngine, Plugin } from '@core'

import {
    BasicGeometryComponent,
    GltfComponent,
    MeshComponent,
    Transform3DComponent,
} from './components'
import { ObjectStore } from './objectStore'
import { createQuery } from './pluginEntities'

class Renderer {
    renderer
    canvas
    scene
    camera

    shouldRender = false

    constructor() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true,
        })

        this.renderer.toneMapping = ReinhardToneMapping
        this.renderer.toneMappingExposure = 2
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.setPixelRatio(1 /* window.devicePixelRatio */)
        this.renderer.debug.checkShaderErrors = true
        // this.renderer.autoClear = false
        // this.renderer.info.autoReset = false
        this.canvas = this.renderer.domElement

        this.scene = new Scene()
        this.camera = new PerspectiveCamera(60, 1, 0.1, 100)

        this.camera.position.set(10, 10, 10)
        this.camera.lookAt(new Vector3())

        // this.scene.add(new AxesHelper(3))
        this.scene.add(new GridHelper(50, 50, 0x0089cc, 0x444444))
    }

    render() {
        if (this.shouldRender) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    setSize(width: number, height: number) {
        const aspect = width / height

        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height, false)
    }

    setCanvasContainer(element: HTMLElement | null) {
        if (element) {
            element.replaceChildren()
            element.appendChild(this.canvas)
            this.shouldRender = true
        } else {
            this.shouldRender = false
        }
    }
}

type ThreeOutput = {
    renderer: {
        render: Renderer['render']
        setCanvasContainer: Renderer['setCanvasContainer']
    }
    three: {
        renderer: Renderer
        objectStore: ObjectStore<string, Group>
    }
}

const positionedRenderableQuery = createQuery(
    (entity) =>
        entity.has(Transform3DComponent) &&
        (entity.has(MeshComponent) || entity.has(GltfComponent)),
)

const meshQuery = createQuery((entity) => entity.has(MeshComponent))

const gltfQuery = createQuery((entity) => entity.has(GltfComponent))

export const pluginThree = (): Plugin<DefaultEngine, ThreeOutput> => ({
    setup: (engine) => {
        const renderer = new Renderer()

        const store = new ObjectStore((id: string) => {
            const group = new Group()
            group.name = id
            return group
        })

        renderer.setSize(1280, 720)

        renderer.renderer.setClearColor('#121212')

        renderer.scene.add(new AmbientLight())
        renderer.scene.add(new DirectionalLight())

        const loader = new GLTFLoader()

        engine.entities.addQueryObserver(meshQuery, (entity) => {
            const basicGeometryComponent = entity.get(BasicGeometryComponent)

            let geometry

            if (basicGeometryComponent) {
                switch (basicGeometryComponent.type) {
                    case 'box':
                        geometry = new BoxGeometry()
                        break
                    case 'sphere':
                        geometry = new SphereGeometry()
                        break
                }
            }

            if (geometry) {
                const mesh = new Mesh(
                    geometry,
                    new MeshStandardMaterial({ color: '#ffffff' }),
                )
                mesh.name = 'mesh'

                const [group, isCreated] = store.getOrCreate(entity.id)
                group.add(mesh)

                if (isCreated) {
                    renderer.scene.add(group)
                }
            }
        })

        engine.entities.addQueryObserver(gltfQuery, (entity) => {
            const gltfComponent = entity.get(GltfComponent)
            const transform = entity.get(Transform3DComponent)

            if (gltfComponent && transform) {
                const [group, isCreated] = store.getOrCreate(entity.id)

                if (isCreated) {
                    renderer.scene.add(group)
                }

                loader.load(gltfComponent.path, (gltf) => {
                    group.add(gltf.scene)
                })
            }
        })

        return {
            renderer: {
                render() {
                    renderer.render()
                },
                setCanvasContainer(element) {
                    renderer.setCanvasContainer(element)
                },
            },
            three: {
                renderer,
                objectStore: store,
            },
        }
    },
    systems: [
        (engine) => {
            engine.entities.query(positionedRenderableQuery).forEach((entity) => {
                const group = engine.three.objectStore.get(entity.id)
                const transform = entity.get(Transform3DComponent)

                if (group && transform) {
                    group.position.fromArray(transform.position)
                    group.scale.fromArray(transform.scale)
                    group.quaternion.fromArray(transform.rotation)
                }
            })
        },
        (engine) => {
            engine.renderer.render()
        },
    ],
})
