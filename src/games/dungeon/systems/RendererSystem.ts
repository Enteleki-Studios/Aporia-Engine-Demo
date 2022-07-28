import {
    AmbientLight,
    Mesh,
    Group,
    Box3,
    CircleGeometry,
    MeshBasicMaterial,
    PointLight,
    PointLightHelper,
} from 'three'

import {
    DirectionalLight,
    DirectionalLightComponent,
    ModelComponent,
    TextSprite,
    AmbientLightComponent,
    PositionComponent,
    HitboxComponent,
    CameraComponent,
    System,
    ECSFilter,
    World,
    HealthComponent,
    PointLightComponent,
} from 'gengine'

import type { Renderer } from 'dungeon/Renderer'

import loadFBX from 'dungeon/utils/loadFBX'
import modelDB from 'modelDB'

async function createModel(modelComponent: ModelComponent<typeof modelDB>) {
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

export class RendererSystem extends System {
    renderer: Renderer

    modelFilter = new ECSFilter([ModelComponent, PositionComponent])
    directionalLightFilter = new ECSFilter([DirectionalLightComponent])
    ambientLightFilter = new ECSFilter([AmbientLightComponent])
    cameraFilter = new ECSFilter([CameraComponent])
    pointLightFilter = new ECSFilter([PositionComponent, PointLightComponent])

    filters = [
        this.modelFilter,
        this.directionalLightFilter,
        this.ambientLightFilter,
        this.cameraFilter,
        this.pointLightFilter,
    ]

    constructor(renderer: Renderer) {
        super()

        this.renderer = renderer
    }

    tick(world: World) {
        this.modelFilter.entities.forEach((entity) => {
            const modelComponent = entity.get(ModelComponent)
            const positionComponent = entity.get(PositionComponent)
            if (modelComponent.group) {
                // Update position
                modelComponent.group.position.copy(positionComponent.position)
                modelComponent.group.quaternion.copy(positionComponent.rotation)

                if (entity.has(HealthComponent)) {
                    const ts = modelComponent.group.getObjectByName('health') as TextSprite
                    const { health } = entity.get(HealthComponent)
                    if (health) {
                        ts.setText(health)
                    } else {
                        ts.visible = false
                    }
                }
            } else if (!modelComponent.isLoading) {
                modelComponent.isLoading = true
                createModel(modelComponent).then((resource) => {
                    const group = new Group()
                    group.add(resource)

                    const labelText = entity.id.split('-')[0]
                    const sprite = new TextSprite(labelText)
                    sprite.renderOrder = 1
                    sprite.material.depthTest = false
                    // group.add(sprite)
                    // this.renderer.registerHelper(sprite)

                    const box = new Box3().setFromObject(resource)
                    sprite.position.y = box.max.y + 0.15
                    sprite.center.set(0.5, 0) // Set origin to center bottom

                    // group.add(new ArrowHelper(new Vector3(0, 0, 1), new Vector3(), 2, 0x00ff00))

                    if (entity.has(HitboxComponent)) {
                        const hitbox = entity.get(HitboxComponent)
                        const collisionGeo = new CircleGeometry(hitbox.radius, 20)
                        collisionGeo.rotateX(-Math.PI / 2)
                        const collisionMat = new MeshBasicMaterial({
                            color: 0xff0000,
                            transparent: true,
                            opacity: 0.3,
                            depthTest: false,
                        })
                        const collisionHelper = new Mesh(collisionGeo, collisionMat)
                        group.add(collisionHelper)
                        this.renderer.registerHelper(collisionHelper)
                    }

                    if (entity.has(PointLightComponent)) {
                        const {
                            color, intensity, decay, distance, offset, castShadow,
                        } = entity.get(PointLightComponent)
                        const pointLight = new PointLight(color, intensity, distance, decay)
                        pointLight.castShadow = castShadow
                        pointLight.position.fromArray(offset)
                        pointLight.shadow.radius = 5
                        group.add(pointLight)
                        const pointLightHelper = new PointLightHelper(pointLight, 0.25)
                        this.renderer.scene.add(pointLightHelper)
                        this.renderer.registerHelper(pointLightHelper)
                    }

                    if (entity.has(HealthComponent)) {
                        const healthSprite = new TextSprite(entity.get(HealthComponent).health, {
                            font: 'arial',
                            color: 'purple',
                        })
                        healthSprite.name = 'health'
                        group.add(healthSprite)
                        healthSprite.position.y = box.max.y + 0.15
                        healthSprite.center.set(0.5, 0)
                    }

                    modelComponent.resource = resource
                    modelComponent.group = group

                    this.renderer.scene.add(group)
                    modelComponent.isLoading = false
                })
            }
        })

        this.directionalLightFilter.entities.forEach((entity) => {
            const { intensity, position, target } = entity.get(DirectionalLightComponent)
            if (!this.renderer.directionalLight) {
                this.renderer.directionalLight = new DirectionalLight(0xFFFFFF, intensity)
                this.renderer.scene.add(this.renderer.directionalLight)
                this.renderer.scene.add(this.renderer.directionalLight.target)

                this.renderer.addHelpers(
                    this.renderer.directionalLight.helper,
                    this.renderer.directionalLight.shadowHelper,
                )
            } else {
                this.renderer.directionalLight.position.copy(position)
                this.renderer.directionalLight.target.position.copy(target)
            }
        })

        this.ambientLightFilter.entities.forEach((entity) => {
            const ambientLightComponent = entity.get(AmbientLightComponent)
            if (!ambientLightComponent.resource) {
                const { color, intensity } = ambientLightComponent
                ambientLightComponent.resource = new AmbientLight(color, intensity)
                this.renderer.scene.add(ambientLightComponent.resource)
            }
        })

        this.cameraFilter.entities.forEach((entity) => {
            const cameraComponent = entity.get(CameraComponent)
            this.renderer.camera.position.copy(cameraComponent.position)
            this.renderer.camera.lookAt(cameraComponent.lookAt)
        })

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

        this.renderer.render(world.timeElapsedS)
    }
}
