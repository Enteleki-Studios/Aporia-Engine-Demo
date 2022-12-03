import {
    AmbientLight,
    BoxGeometry,
    Mesh,
    Group,
    Box3,
    CircleGeometry,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PointLight,
    PointLightHelper,
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
    HitboxComponent,
    CameraComponent,
    ECSFilter,
    World,
    HealthComponent,
    PointLightComponent,
    RendererSystemBase,
    Entity,
} from 'gengine'

import type { Renderer } from 'dungeon/Renderer'

import loadFBX from 'dungeon/utils/loadFBX'
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

function makeCollisionHelper(hitboxComponent: HitboxComponent) {
    const collisionGeo = new CircleGeometry(hitboxComponent.radius, 20)
    collisionGeo.rotateX(-Math.PI / 2)
    const collisionMat = new MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.3,
        depthTest: false,
    })
    const collisionHelper = new Mesh(collisionGeo, collisionMat)
    return collisionHelper
}

function makePointLight(pointLightComponent: PointLightComponent) {
    const {
        color, intensity, decay, distance, offset, castShadow,
    } = pointLightComponent
    const pointLight = new PointLight(color, intensity, distance, decay)
    pointLight.castShadow = castShadow
    pointLight.position.fromArray(offset)
    pointLight.shadow.radius = 5
    return pointLight
}

function makeHealthSprite(healthComponent: HealthComponent) {
    const healthSprite = new TextSprite(healthComponent.health, {
        font: 'arial',
        color: 'purple',
    })
    healthSprite.name = 'health'
    healthSprite.center.set(0.5, 0)
    return healthSprite
}

export class RendererSystem extends RendererSystemBase {
    renderer: Renderer

    modelFilter = new ECSFilter([ModelComponent, PositionComponent])
    directionalLightFilter = new ECSFilter([DirectionalLightComponent])
    ambientLightFilter = new ECSFilter([AmbientLightComponent])
    cameraFilter = new ECSFilter([CameraComponent])
    pointLightFilter = new ECSFilter([PositionComponent, PointLightComponent])
    boxFilter = new ECSFilter([BasicGeometryComponent, PositionComponent])

    filters = [
        this.modelFilter,
        this.directionalLightFilter,
        this.ambientLightFilter,
        this.cameraFilter,
        this.pointLightFilter,
        this.boxFilter,
    ]

    constructor(renderer: Renderer) {
        super(renderer)

        this.renderer = renderer
    }

    receiveEntity(entity: Entity, filter: ECSFilter): void {
        switch (filter) {
            case this.modelFilter: {
                const modelComponent = entity.get(ModelComponent)
                modelComponent.isLoading = true
                loadModel(modelComponent).then((resource) => {
                    this.addObject(entity, 'model', resource)
                    const box = new Box3().setFromObject(resource)

                    if (entity.has(HitboxComponent)) {
                        const hitbox = entity.get(HitboxComponent)
                        const collisionHelper = makeCollisionHelper(hitbox)

                        this.addObject(entity, 'collisionHelper', collisionHelper)
                        this.renderer.registerHelper(collisionHelper)
                    }

                    if (entity.has(PointLightComponent)) {
                        const pointLight = makePointLight(entity.get(PointLightComponent))
                        this.addObject(entity, 'pointlight', pointLight)

                        const pointLightHelper = new PointLightHelper(pointLight, 0.25)
                        this.renderer.scene.add(pointLightHelper)
                        this.renderer.registerHelper(pointLightHelper)
                    }

                    if (entity.has(HealthComponent)) {
                        const healthSprite = makeHealthSprite(entity.get(HealthComponent))
                        this.addObject(entity, 'health', healthSprite)
                        healthSprite.position.y = box.max.y + 0.15
                    }

                    modelComponent.resource = resource
                    modelComponent.isLoading = false
                })
                break
            }
            case this.directionalLightFilter: {
                const { intensity } = entity.get(DirectionalLightComponent)
                const directionalLight = new DirectionalLight(0xFFFFFF, intensity)
                this.addObject(entity, 'directionalLight', directionalLight)
                this.addObject(entity, 'directionalLightTarget', directionalLight.target)

                this.renderer.addHelpers(
                    directionalLight.helper,
                    directionalLight.shadowHelper,
                )
                break
            }
            case this.ambientLightFilter: {
                const { color, intensity } = entity.get(AmbientLightComponent)
                this.addObject(entity, 'ambient', new AmbientLight(color, intensity))
                break
            }
            case this.boxFilter: {
                const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
                this.addObject(entity, 'box', mesh)
                this.getGroup(entity)?.position.copy(entity.get(PositionComponent).position)
                break
            }
            default:
                break
        }
    }

    tick(world: World) {
        this.modelFilter.entities.forEach((entity) => {
            const { position } = entity.get(PositionComponent)
            const group = this.getGroup(entity)
            if (group) {
                // Update position
                group.position.copy(position)

                if (entity.has(DirectionComponent)) {
                    const { direction } = entity.get(DirectionComponent)
                    group.lookAt(position.clone().add(direction))
                }

                // Update health text
                if (entity.has(HealthComponent)) {
                    const ts = this.getObject(entity, 'health') as TextSprite
                    const { health } = entity.get(HealthComponent)
                    if (health) {
                        ts.setText(health)
                    } else {
                        ts.visible = false
                    }
                }
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

        this.renderer.render(world.timeElapsedS)
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
