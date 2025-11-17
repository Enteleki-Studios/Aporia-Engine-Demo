import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    Group,
    Mesh,
    MeshStandardMaterial,
    // MeshBasicMaterial,
    SphereGeometry,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { type DefaultResources, ObjectStore, type Plugin } from '@core'

import {
    BasicGeometryComponent,
    MeshComponent,
    Transform3DComponent,
} from '@core/components'

import { createQuery } from '@pluginEntities'

import { AxesHelper } from './axesHelper'
import { GltfComponent } from './components'
import { DefaultGrid } from './defaultGrid'
import { Renderer } from './renderer'
import { SkySphere } from './skySphere'

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
    }
}

const positionedRenderableQuery = createQuery(
    [Transform3DComponent],
    (entity) => entity.has(MeshComponent) || entity.has(GltfComponent),
)

const meshQuery = createQuery([MeshComponent])

const gltfQuery = createQuery([GltfComponent])

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

        renderer.scene.add(new AmbientLight())
        renderer.scene.add(new DirectionalLight())

        renderer.scene.add(new AxesHelper())
        // renderer.scene.add(new DefaultCube())
        renderer.scene.add(new DefaultGrid(10))
        // renderer.scene.add(new GridHelper(50, 50, 0x0089cc, 0x444444))
        renderer.scene.add(new SkySphere())

        // renderer.scene.overrideMaterial = new MeshBasicMaterial({ wireframe: true, color: '#0089cc' })

        const gltfLoader = new GLTFLoader()

        return {
            three: {
                renderer,
                objectStore,
                gltfLoader,
            },
        }
    },
    init: (runtime) => {
        runtime.resources.entities.addQueryObserver(meshQuery, ([_, entity]) => {
            const { objectStore, renderer } = runtime.resources.three
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

                const [group, isCreated] = objectStore.getOrCreate(entity.id)
                group.add(mesh)

                if (isCreated) {
                    renderer.scene.add(group)
                }
            }
        })

        runtime.resources.entities.addQueryObserver(
            gltfQuery,
            ([[gltfComponent], entity]) => {
                const { objectStore, renderer, gltfLoader } = runtime.resources.three
                // TODO: require transform and apply transform when group is added to scene
                const transform = entity.get(Transform3DComponent)

                if (transform) {
                    const [group, isCreated] = objectStore.getOrCreate(entity.id)

                    if (isCreated) {
                        renderer.scene.add(group)
                    }

                    gltfLoader.load(gltfComponent.path, (gltf) => {
                        group.add(gltf.scene)
                    })
                }
            },
        )

        runtime.addSystem((world) => {
            world.resources.entities
                .query(positionedRenderableQuery)
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
            world.resources.three.renderer.render()
        })
    },
})
