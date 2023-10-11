import { Vec3 } from 'gl-matrix/dist/esm'
import {
    AmbientLight,
    BoxGeometry,
    Mesh,
    Group,
    Box3,
    MeshStandardMaterial,
    PointLight,
    PointLightHelper,
    SphereGeometry,
    CylinderGeometry,
    Object3D,
} from 'three'

import {
    basicGeometryComponent,
    DirectionalLight,
    directionalLightComponent,
    directionComponent,
    modelComponent,
    TextSprite,
    ambientLightComponent,
    positionComponent,
    cameraComponent,
    ECSFilter,
    healthComponent,
    pointLightComponent,
    Entity,
    colliderComponent,
    Collider,
    Octree,
    OctreeHelper,
    Array3,
    World,
    modelFilter,
    directionalLightFilter,
    ambientLightFilter,
    boxFilter,
    collidingFilter,
    cameraFilter,
    movingEntitiesFilter,
    rotatingEntitiesFilter,
    tags,
    ResourceManager,
    createSystem,
} from 'gengine'

import type { Renderer } from 'Renderer'

import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'

async function loadModel(modelC: ReturnType<typeof modelComponent>) {
    const { modelName, castShadow } = modelC

    const { modelPath, texturePath, scale, translate } = modelDB[modelName]

    const model: Group = await loadFBX(modelPath, texturePath, { castShadow })
    model.scale.setScalar(scale)
    if (translate) {
        const obj = model.children[0] as Mesh
        obj.geometry.translate(...translate)
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

const makeHealthSprite = (health: ReturnType<typeof healthComponent>) => {
    const healthSprite = new TextSprite(health.health, {
        font: 'arial',
        color: 'purple',
    })
    healthSprite.name = 'health'
    healthSprite.center.set(0.5, 0)
    return healthSprite
}

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

export const rendererSystem = createSystem<{ renderer: Renderer; objectManager: ResourceManager<Group, Object3D> }>(
    'render',
    ({ renderer, objectManager }) =>
        (world: World) => {
            // world.ecs.filterBy(modelFilter).forEach((entity) => {
            //     if (entity.has(healthComponent)) {
            //         this.updateHealthIndicator(entity)
            //     }
            // })

            world.ecs.filterBy(directionalLightFilter).forEach((entity) => {
                const { position, target } = entity.get(directionalLightComponent)
                objectManager.getResource(entity.id, 'directionalLight')?.position.fromArray(position)
                objectManager.getResource(entity.id, 'directionalLightTarget')?.position.fromArray(target)
            })

            world.ecs.filterBy(cameraFilter).forEach((entity) => {
                const { position, lookAt } = entity.get(cameraComponent)
                renderer.camera.position.fromArray(position)
                renderer.camera.lookAt(...lookAt)
            })

            world.ecs.filterBy(movingEntitiesFilter).forEach((entity) => {
                const { position } = entity.get(positionComponent)
                objectManager.getContainer(entity.id)?.position.fromArray(position)
            })

            // TODO only do this for dirty entities/components
            world.ecs.filterBy(rotatingEntitiesFilter).forEach((entity) => {
                // TODO this if statement is a hack...
                if (!entity.hasTag(tags.hero)) {
                    const { position } = entity.get(positionComponent)
                    const { direction } = entity.get(directionComponent)
                    // this.getGroup(entity).lookAt(position.clone().add(direction))
                    const lookAt: Array3 = [0, 0, 0]
                    Vec3.add(lookAt, position, direction)
                    objectManager.getContainer(entity.id)?.lookAt(...lookAt)
                }
            })

            renderer.render()
        },
)

export const entityReceiver =
    ({
        renderer,
        objectManager,
        octree,
        octreeHelper,
    }: {
        renderer: Renderer
        objectManager: ResourceManager<Group, Object3D>
        octree: Octree
        octreeHelper: OctreeHelper
    }) =>
    (entity: Entity, filter: ECSFilter) => {
        switch (filter) {
            case modelFilter: {
                const mc = entity.get(modelComponent)
                mc.isLoading = true
                loadModel(mc)
                    .then((resource) => {
                        objectManager.addResource(entity.id, 'model', resource)
                        const box = new Box3().setFromObject(resource)

                        const healthSprite = objectManager.getResource(entity.id, 'health')
                        if (healthSprite) {
                            healthSprite.position.y = box.max.y + 0.15
                        }

                        // mc.resource = resource
                        mc.isLoading = false
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
                objectManager.getContainer(entity.id)?.position.fromArray(entity.get(positionComponent).position)
                break
            }
            case collidingFilter: {
                const { collider } = entity.get(colliderComponent)
                const { position } = entity.get(positionComponent)

                const collisionHelper = new Mesh(
                    makeColliderHelper(collider).translate(0, collider.height / 2, 0),
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
            default:
                break
        }

        if (entity.has(healthComponent)) {
            if (!objectManager.getResource(entity.id, 'health')) {
                const healthSprite = makeHealthSprite(entity.get(healthComponent))
                objectManager.addResource(entity.id, 'health', healthSprite)
            }
        }

        if (entity.has(pointLightComponent)) {
            if (!objectManager.getResource(entity.id, 'pointLight')) {
                const pointLight = makePointLight(entity.get(pointLightComponent))
                objectManager.addResource(entity.id, 'pointlight', pointLight)

                const pointLightHelper = new PointLightHelper(pointLight, 0.25)
                renderer.scene.add(pointLightHelper)
                renderer.registerHelper(pointLightHelper)
            }
        }

        if (entity.has(positionComponent)) {
            const group = objectManager.getContainer(entity.id) ?? objectManager.newContainer(entity.id)
            group.position.fromArray(entity.get(positionComponent).position)
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

// this.pointLightFilter.entities.forEach((entity) => {
//     if (!entity.has(ModelComponent)) {
//         const {
//             color, intensity, decay, distance, offset, castShadow,
//         } = entity.get(PointLightComponent)
//         const pointLight = new PointLight(color, intensity, distance, decay)
//         pointLight.castShadow = castShadow
//         pointLight.position.fromArray(offset)
//         this.renderer.scene.add(pointLight)
//         const pointLightHelper = new PointLightHelper(pointLight, 0.25)
//         this.renderer.scene.add(pointLightHelper)
//         this.renderer.registerHelper(pointLightHelper)
//     }
// })

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
