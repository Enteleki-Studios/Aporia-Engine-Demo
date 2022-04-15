import { AmbientLight, Mesh, Group, Box3, CircleGeometry, MeshBasicMaterial } from 'three'

import {
    DirectionalLight,
    DirectionalLightComponent,
    ModelComponent,
    TextSprite,
    ComponentManager,
    AmbientLightComponent,
    PositionComponent,
    HitboxComponent,
} from 'gengine'

import type { Renderer } from 'dungeon/Renderer'

import loadFBX from 'dungeon/utils/loadFBX'
import modelDB from 'modelDB'

import type { CameraComponent } from 'components'

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

export function rendererSystem(componentManager: ComponentManager, renderer: Renderer) {
    componentManager.getTuplesByQueryGeneric<[ModelComponent<typeof modelDB>, PositionComponent]>(
        ['model', 'position'],
    ).forEach(([modelComponent, positionComponent]) => {
        if (modelComponent.group) {
            // Update position
            if (positionComponent.needsUpdate) {
                modelComponent.group.position.copy(positionComponent.position)
                modelComponent.group.quaternion.copy(positionComponent.rotation)
                positionComponent.needsUpdate = false
            }
        } else if (!modelComponent.isLoading) {
            modelComponent.isLoading = true
            createModel(modelComponent).then((resource) => {
                const group = new Group()
                group.add(resource)

                const tripcode = modelComponent.entityId.split('-')[0]
                const sprite = new TextSprite(tripcode)
                sprite.renderOrder = 1
                sprite.material.depthTest = false
                group.add(sprite)
                renderer.registerHelper(sprite)

                const box = new Box3().setFromObject(resource)
                sprite.position.y = box.max.y + 0.15
                sprite.center.set(0.5, 0) // Set origin to center bottom

                if (componentManager.has(modelComponent.entityId, 'hitbox')) {
                    const hitbox = componentManager.get<HitboxComponent>(modelComponent.entityId, 'hitbox')
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
                }

                modelComponent.resource = resource
                modelComponent.group = group

                renderer.scene.add(group)
                modelComponent.isLoading = false
            })
        }
    })

    componentManager.getTuplesByQueryGeneric<[DirectionalLightComponent]>(
        ['directionalLight'],
    ).forEach(([directionalLightComponent]) => {
        if (!renderer.directionalLight) {
            renderer.directionalLight = new DirectionalLight(0xFFFFFF, 0.4)
            renderer.scene.add(renderer.directionalLight)
            renderer.scene.add(renderer.directionalLight.target)

            renderer.addHelpers(renderer.directionalLight.helper, renderer.directionalLight.shadowHelper)
            renderer.addHelpers(renderer.directionalLight.shadowHelper)
        } else if (directionalLightComponent.needsUpdate) {
            renderer.directionalLight.position.copy(directionalLightComponent.position)
            renderer.directionalLight.target.position.copy(directionalLightComponent.target)
            directionalLightComponent.needsUpdate = false
        }
    })

    componentManager.getTuplesByQueryGeneric<[AmbientLightComponent]>(
        ['ambientLight'],
    ).forEach(([ambientLightComponent]) => {
        if (!ambientLightComponent.resource) {
            const { color, intensity } = ambientLightComponent
            ambientLightComponent.resource = new AmbientLight(color, intensity)
            renderer.scene.add(ambientLightComponent.resource)
        }
    })

    componentManager.getTuplesByQueryGeneric<[CameraComponent]>(
        ['camera'],
    ).forEach(([cameraComponent]) => {
        renderer.camera.position.copy(cameraComponent.position)
        renderer.camera.lookAt(cameraComponent.lookAt)
    })
}
