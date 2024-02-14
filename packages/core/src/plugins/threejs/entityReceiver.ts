import {
    TextureLoader,
    Group,
    Object3D,
    PointLight,
    BoxGeometry,
    AmbientLight,
    PointLightHelper,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    Mesh,
    CylinderGeometry,
    SphereGeometry,
    AnimationMixer,
    AnimationClip,
    AnimationAction,
    Box3,
    BufferGeometry,
    Material,
    CircleGeometry,
} from 'three'
import { Octree } from 'three/examples/jsm/math/Octree'
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper'

import { Entity, ECSFilter } from 'core'
import { ResourceManager } from 'managers/ResourceManager'
import { DirectionalLight } from 'threejs/DirectionalLight'
import {
    animationComponent,
    modelComponent,
    pointLightComponent,
    basicGeometryComponent,
    ambientLightComponent,
    colliderComponent,
    transform3D,
    mesh2D,
    material,
    Collider,
    directionalLightComponent,
} from 'components'
import {
    modelFilter,
    directionalLightFilter,
    ambientLightFilter,
    boxFilter,
    collidingFilter,
    mesh2DFilter,
} from 'filters'

import type { Renderer } from './Renderer'
import { loadFBX } from './loadFBX'
import { makeAnimationManager } from './object3dManager'

async function loadModel(modelC: ReturnType<typeof modelComponent>) {
    const { castShadow } = modelC

    const { modelPath, texturePath, scale, translate } = modelC.data

    const model: Group = await loadFBX(modelPath, texturePath, { castShadow })
    model.scale.setScalar(scale)
    if (translate) {
        // const obj = model.children[0] as Mesh
        // obj.geometry.translate(...translate)
        model.position.set(...translate)
    }

    return model
}

const makePointLight = (pl: ReturnType<typeof pointLightComponent>) => {
    const { color, intensity, decay, distance, offset, castShadow } = pl
    const pointLight = new PointLight(color, intensity, distance, decay)
    pointLight.castShadow = castShadow
    pointLight.position.fromArray(offset)
    pointLight.shadow.radius = 5
    return pointLight
}

// const makeHealthSprite = (health: ReturnType<typeof healthComponent>) => {
//     const healthSprite = new TextSprite(health.health, {
//         font: 'arial',
//         color: 'purple',
//     })
//     healthSprite.name = 'health'
//     healthSprite.center.set(0.5, 0)
//     return healthSprite
// }

const makeBasicGeometry = (geoComponent: ReturnType<typeof basicGeometryComponent>) => {
    const { geometryType, radius, size } = geoComponent
    // TODO restore discriminated union here
    switch (geometryType) {
        case 'box':
            return new BoxGeometry(size ?? 1, size ?? 1, size ?? 1)
        case 'sphere':
            return new SphereGeometry(radius ?? 1)
        default:
            return new BoxGeometry(1, 1, 1)
    }
}

const makeColliderHelper = (collider: Collider) => {
    switch (collider.type) {
        case 'box': {
            const { width, height, depth } = collider
            return new BoxGeometry(width, height, depth)
        }
        case 'cylinder': {
            const { radius, height, resolution } = collider
            return new CylinderGeometry(radius, radius, height, Math.max(resolution, 10))
        }
        default:
            return new BoxGeometry(1, 1, 1)
    }
}

function loadAnimations(
    modelComponent: { modelName: string; data: { animations?: Record<string, string> } },
    model: Object3D,
) {
    const { data } = modelComponent
    const { animations: animationIndex } = data

    const mixer = new AnimationMixer(model)

    // console.debug(model.animations)

    const animations: { name: string; clip: AnimationClip; action: AnimationAction }[] = []

    if (model.animations.length && animationIndex) {
        // TODO refactor to map
        Object.entries(animationIndex).forEach(([key, name]) => {
            const animation = model.animations.find((a) => a.name === name)
            if (animation) {
                animations.push({
                    name: key,
                    clip: animation,
                    action: mixer.clipAction(animation),
                })
            }
        })
    }

    return {
        mixer,
        animations,
    }
}

const textureLoader = new TextureLoader()

export const entityReceiver =
    ({
        renderer,
        objectManager,
        octree,
        octreeHelper,
        animationManager,
    }: {
        renderer: Renderer
        objectManager: ResourceManager<Group, Object3D>
        octree: Octree
        octreeHelper: OctreeHelper
        animationManager: ReturnType<typeof makeAnimationManager>
    }) =>
    (entity: Entity, filter: ECSFilter) => {
        switch (filter) {
            case modelFilter: {
                const mc = entity.get(modelComponent)
                loadModel(mc)
                    .then((resource) => {
                        objectManager.addResource(entity.id, 'model', resource)

                        const healthSprite = objectManager.getResource(entity.id, 'health')
                        if (healthSprite) {
                            const box = new Box3().setFromObject(resource)
                            healthSprite.position.y = box.max.y + 0.15
                        }

                        if (entity.has(animationComponent)) {
                            const { mixer, animations } = loadAnimations(mc, resource)

                            animationManager.newContainer(entity.id, mixer)
                            animations.forEach((animation) => {
                                animationManager.addResource(entity.id, animation.name, animation)
                            })
                        }
                    })
                    .catch(() => {
                        /**/
                    })
                break
            }
            case directionalLightFilter: {
                const { intensity } = entity.get(directionalLightComponent)
                const directionalLight = new DirectionalLight(0xffffff, intensity)
                objectManager.addResource(entity.id, 'directionalLight', directionalLight)
                objectManager.addResource(entity.id, 'directionalLightTarget', directionalLight.target)

                renderer.addHelpers(directionalLight.helper, directionalLight.shadowHelper)
                break
            }
            case ambientLightFilter: {
                const { color, intensity } = entity.get(ambientLightComponent)
                objectManager.addResource(entity.id, 'ambient', new AmbientLight(color, intensity))
                break
            }
            case boxFilter: {
                const basicGeometry = entity.get(basicGeometryComponent)

                const mesh = new Mesh(
                    makeBasicGeometry(basicGeometry),
                    new MeshStandardMaterial({ color: basicGeometry.color }),
                )
                objectManager.addResource(entity.id, 'basicGeometry', mesh)
                objectManager.getContainer(entity.id)?.position.fromArray(entity.get(transform3D).position)
                break
            }
            case collidingFilter: {
                const { collider } = entity.get(colliderComponent)
                const { position } = entity.get(transform3D)

                const collisionHelper = new Mesh(
                    makeColliderHelper(collider),
                    new MeshStandardMaterial({
                        transparent: true,
                        opacity: 0.3,
                        color: 0xcc0089,
                        emissive: 0xff0089,
                        emissiveIntensity: 1,
                    }),
                )
                collisionHelper.position.fromArray(position)

                renderer.scene.add(collisionHelper)
                renderer.registerHelper(collisionHelper)

                octree.fromGraphNode(collisionHelper)
                octreeHelper.update()
                break
            }
            case mesh2DFilter: {
                const meshComponent = entity.get(mesh2D)

                let geometry: BufferGeometry | null = null
                let mat: Material = new MeshBasicMaterial({ color: '#ff0088' })

                switch (meshComponent.shape) {
                    case 'plane': {
                        geometry = new PlaneGeometry(meshComponent.width, meshComponent.height)
                        break
                    }
                    case 'circle':
                        geometry = new CircleGeometry(meshComponent.radius)
                        break
                    default:
                        break
                }

                if (entity.has(material)) {
                    const materialComponent = entity.get(material)
                    switch (materialComponent.material) {
                        case 'basic':
                            mat = new MeshBasicMaterial({ color: materialComponent.color })
                            break
                        case 'standard': {
                            const sMat = new MeshStandardMaterial()
                            const { color, mapUrl, wrapS, wrapT, repeatX, repeatY } = materialComponent
                            if (color) {
                                sMat.color.set(color)
                            }
                            if (mapUrl) {
                                const texture = textureLoader.load(mapUrl)
                                sMat.map = texture

                                if (wrapS) {
                                    texture.wrapS = RepeatWrapping
                                }
                                if (wrapT) {
                                    texture.wrapT = RepeatWrapping
                                }
                                if (repeatX || repeatY) {
                                    texture.repeat.set(repeatX ?? 1, repeatY ?? 1)
                                }
                            }
                            mat = sMat
                            break
                        }
                        default:
                            break
                    }
                }

                if (geometry) {
                    const mesh = new Mesh(geometry, mat)
                    objectManager.addResource(entity.id, 'mesh2D', mesh)
                }

                break
            }
            default:
                break
        }

        // if (entity.has(healthComponent)) {
        //     if (!objectManager.getResource(entity.id, 'health')) {
        //         const healthSprite = makeHealthSprite(entity.get(healthComponent))
        //         objectManager.addResource(entity.id, 'health', healthSprite)
        //     }
        // }

        if (entity.has(pointLightComponent)) {
            if (!objectManager.getResource(entity.id, 'pointLight')) {
                const pointLight = makePointLight(entity.get(pointLightComponent))
                objectManager.addResource(entity.id, 'pointlight', pointLight)

                const pointLightHelper = new PointLightHelper(pointLight, 0.25)
                renderer.scene.add(pointLightHelper)
                renderer.registerHelper(pointLightHelper)
            }
        }

        if (entity.has(transform3D)) {
            const group = objectManager.getContainer(entity.id) ?? objectManager.newContainer(entity.id)

            const { position, rotation, scale } = entity.get(transform3D)

            group.position.fromArray(position)
            group.scale.fromArray(scale)
            group.rotation.fromArray(rotation)
        }
    }

// const labelText = entity.id.split('-')[0]
// const sprite = new TextSprite(labelText)
// sprite.renderOrder = 1
// sprite.material.depthTest = false
// this.renderer.registerHelper(sprite)
// sprite.position.y = box.max.y + 0.15
// sprite.center.set(0.5, 0) // Set origin to center bottom

// group.add(new ArrowHelper(new Vector3(0, 0, 1), new Vector3(), 2, 0x00ff00))

// updateHealthIndicator = this.applyToObject((ts, entity) => {
//     const { health } = entity.get(healthComponent)
//     if (health) {
//         if ((ts as TextSprite).text !== health.toString()) {
//             ;(ts as TextSprite).setText(health)
//         }
//     } else {
//         ts.visible = false
//     }
// })('health')
