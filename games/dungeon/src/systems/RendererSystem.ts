import {
    AmbientLight,
    BoxGeometry,
    Mesh,
    Group,
    Box3,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PointLight,
    PointLightHelper,
    Color,
    SphereGeometry,
    CylinderGeometry,
} from 'three'

import {
    BasicGeometryComponent,
    DirectionalLight,
    DirectionalLightComponent,
    DirectionComponent,
    ModelComponent,
    TextSprite,
    AmbientLightComponent,
    PositionComponent,
    CameraComponent,
    ECSFilter,
    HealthComponent,
    PointLightComponent,
    RendererSystemBase,
    Entity,
    VelocityComponent,
    ColliderComponent,
    Collider,
    Octree,
    OctreeHelper,
} from 'gengine'

import type { Renderer } from 'Renderer'

import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'

async function loadModel(modelComponent: ModelComponent<typeof modelDB>) {
    const { modelName } = modelComponent

    const { modelPath, texturePath, scale, translate } = modelDB[modelName]

    const model: Group = await loadFBX(modelPath, texturePath)
    model.scale.setScalar(scale)
    if (translate) {
        const obj = model.children[0] as Mesh
        obj.geometry.translate(...translate)
    }

    return model
}

const makePointLight = (pointLightComponent: PointLightComponent) => {
    const { color, intensity, decay, distance, offset, castShadow } = pointLightComponent
    const pointLight = new PointLight(color, intensity, distance, decay)
    pointLight.castShadow = castShadow
    pointLight.position.fromArray(offset)
    pointLight.shadow.radius = 5
    return pointLight
}

const makeHealthSprite = (healthComponent: HealthComponent) => {
    const healthSprite = new TextSprite(healthComponent.health, {
        font: 'arial',
        color: 'purple',
    })
    healthSprite.name = 'health'
    healthSprite.center.set(0.5, 0)
    return healthSprite
}

const makeBasicGeometry = (geoComponent: BasicGeometryComponent) => {
    const { geometryType, radius, size } = geoComponent
    switch (geometryType) {
        case 'box':
            return new BoxGeometry(size, size, size)
        case 'sphere':
            return new SphereGeometry(radius)
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

export const octree = new Octree()

export class RendererSystem extends RendererSystemBase {
    renderer: Renderer

    modelFilter = new ECSFilter([ModelComponent, PositionComponent])
    directionalLightFilter = new ECSFilter([DirectionalLightComponent])
    ambientLightFilter = new ECSFilter([AmbientLightComponent])
    cameraFilter = new ECSFilter([CameraComponent])
    pointLightFilter = new ECSFilter([PositionComponent, PointLightComponent])
    boxFilter = new ECSFilter([BasicGeometryComponent, PositionComponent])
    movingFilter = new ECSFilter([PositionComponent, VelocityComponent])
    rotatingEntities = new ECSFilter([DirectionComponent, PositionComponent])
    collidingFilter = new ECSFilter([ColliderComponent, PositionComponent])

    filters = [
        this.modelFilter,
        this.directionalLightFilter,
        this.ambientLightFilter,
        this.cameraFilter,
        this.pointLightFilter,
        this.boxFilter,
        this.movingFilter,
        this.rotatingEntities,
        this.collidingFilter,
    ]

    // TODO For testing only
    // octree = new Octree()
    octree = octree
    octreeHelper: OctreeHelper

    constructor(renderer: Renderer) {
        super(renderer)

        this.renderer = renderer

        this.octreeHelper = new OctreeHelper(this.octree, new Color(0x0089cc))
        this.octreeHelper.visible = false
        this.renderer.scene.add(this.octreeHelper)
    }

    updateHealthIndicator = this.applyToObject((ts, entity) => {
        const { health } = entity.get(HealthComponent)
        if (health) {
            if ((ts as TextSprite).text !== health.toString()) {
                ;(ts as TextSprite).setText(health)
            }
        } else {
            ts.visible = false
        }
    })('health')

    receiveEntity(entity: Entity, filter: ECSFilter): void {
        switch (filter) {
            case this.modelFilter: {
                const modelComponent = entity.get(ModelComponent)
                modelComponent.isLoading = true
                loadModel(modelComponent)
                    .then((resource) => {
                        this.addObject(entity, 'model', resource)
                        const box = new Box3().setFromObject(resource)

                        const healthSprite = this.getObject(entity, 'health')
                        if (healthSprite) {
                            healthSprite.position.y = box.max.y + 0.15
                        }

                        modelComponent.resource = resource
                        modelComponent.isLoading = false
                    })
                    .catch(() => {
                        /**/
                    })
                break
            }
            case this.directionalLightFilter: {
                const { intensity } = entity.get(DirectionalLightComponent)
                const directionalLight = new DirectionalLight(0xffffff, intensity)
                this.addObject(entity, 'directionalLight', directionalLight)
                this.addObject(entity, 'directionalLightTarget', directionalLight.target)

                this.renderer.addHelpers(directionalLight.helper, directionalLight.shadowHelper)
                break
            }
            case this.ambientLightFilter: {
                const { color, intensity } = entity.get(AmbientLightComponent)
                this.addObject(entity, 'ambient', new AmbientLight(color, intensity))
                break
            }
            case this.boxFilter: {
                const basicGeometryComponent = entity.get(BasicGeometryComponent)

                const mesh = new Mesh(
                    makeBasicGeometry(basicGeometryComponent),
                    new MeshStandardMaterial({ color: basicGeometryComponent.color }),
                )

                this.addObject(entity, 'basicGeometry', mesh)
                this.getGroup(entity).position.copy(entity.get(PositionComponent).position)
                break
            }
            case this.collidingFilter: {
                const { collider } = entity.get(ColliderComponent)
                const { position } = entity.get(PositionComponent)

                const collisionHelper = new Mesh(
                    makeColliderHelper(collider).translate(0, collider.height / 2, 0),
                    new MeshBasicMaterial({ transparent: true, opacity: 0.3, color: 0xcc0089 }),
                )
                collisionHelper.position.copy(position)

                this.renderer.scene.add(collisionHelper)

                this.octree.fromGraphNode(collisionHelper)
                this.octreeHelper.update()
                break
            }
            default:
                break
        }

        if (entity.has(HealthComponent)) {
            const healthSprite = makeHealthSprite(entity.get(HealthComponent))
            this.addObject(entity, 'health', healthSprite)
        }

        if (entity.has(PointLightComponent)) {
            const pointLight = makePointLight(entity.get(PointLightComponent))
            this.addObject(entity, 'pointlight', pointLight)

            const pointLightHelper = new PointLightHelper(pointLight, 0.25)
            this.renderer.scene.add(pointLightHelper)
            this.renderer.registerHelper(pointLightHelper)
        }

        if (entity.has(PositionComponent)) {
            this.getGroup(entity).position.copy(entity.get(PositionComponent).position)
        }
    }

    tick() {
        this.modelFilter.entities.forEach((entity) => {
            if (entity.has(HealthComponent)) {
                this.updateHealthIndicator(entity)
            }
        })

        this.directionalLightFilter.entities.forEach((entity) => {
            const { position, target } = entity.get(DirectionalLightComponent)
            this.getObject(entity, 'directionalLight')?.position.copy(position)
            this.getObject(entity, 'directionalLightTarget')?.position.copy(target)
        })

        this.cameraFilter.entities.forEach((entity) => {
            const cameraComponent = entity.get(CameraComponent)
            this.renderer.camera.position.copy(cameraComponent.position)
            this.renderer.camera.lookAt(cameraComponent.lookAt)
        })

        this.movingFilter.entities.forEach((entity) => {
            const { position } = entity.get(PositionComponent)
            this.getGroup(entity).position.copy(position)
        })

        // TODO only do this for dirty entities/components
        this.rotatingEntities.entities.forEach((entity) => {
            const { position } = entity.get(PositionComponent)
            const { direction } = entity.get(DirectionComponent)
            this.getGroup(entity).lookAt(position.clone().add(direction))
        })

        this.renderer.render()
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
