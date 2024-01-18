import { Group, Object3D } from 'three'

import { createSystem, World } from 'core'
import { ResourceManager } from 'managers/ResourceManager'
import { cameraFilter, movingEntitiesFilter, positionedEntitiesFilter, rotatingEntitiesFilter } from 'filters'

import { cameraComponent, directionComponent, transform3D } from 'components'

import { Renderer } from './Renderer'

const LABEL = 'render'
export const rendererSystem = createSystem<{ renderer: Renderer; objectManager: ResourceManager<Group, Object3D> }>(
    LABEL,
    ({ renderer, objectManager }) =>
        (world: World) => {
            // world.ecs.filterBy(modelFilter).forEach((entity) => {
            //     if (entity.has(healthComponent)) {
            //         this.updateHealthIndicator(entity)
            //     }
            // })

            // world.ecs.filterBy(directionalLightFilter).forEach((entity) => {
            //     const { position, target } = entity.get(directionalLightComponent)
            //     objectManager.getResource(entity.id, 'directionalLight')?.position.fromArray(position)
            //     objectManager.getResource(entity.id, 'directionalLightTarget')?.position.fromArray(target)
            // })

            for (const entity of world.ecs.filterBy(cameraFilter)) {
                const { position, lookAt } = entity.get(cameraComponent)
                renderer.camera.position.fromArray(position)
                renderer.camera.lookAt(...lookAt)
            }

            for (const entity of world.ecs.filterBy(positionedEntitiesFilter)) {
                const { position, rotation } = entity.get(transform3D)
                const group = objectManager.getContainer(entity.id)

                if (group) {
                    group.position.fromArray(position)
                    group.rotation.fromArray(rotation)
                }
            }

            // TODO only do this for dirty entities/components
            // for (const entity of world.ecs.filterBy(rotatingEntitiesFilter)) {
            //     // TODO this if statement is a hack...
            //     // if (!entity.hasTag(tags.hero)) {
            //     const { position } = entity.get(transform3D)
            //     const { direction } = entity.get(directionComponent)

            //     objectManager
            //         .getContainer(entity.id)
            //         ?.lookAt(position[0] + direction[0], position[1] + direction[1], position[2] + direction[2])
            //     // }
            // }

            renderer.render()

            world.stats.systemsStats[LABEL].extra.calls = renderer.renderer.info.render.calls
            world.stats.systemsStats[LABEL].extra.triangles = renderer.renderer.info.render.triangles
            world.stats.systemsStats[LABEL].extra.geometries = renderer.renderer.info.memory.geometries
            world.stats.systemsStats[LABEL].extra.textures = renderer.renderer.info.memory.textures

            const shaders = renderer.renderer.info.programs
            if (shaders) {
                world.stats.systemsStats[LABEL].extra.shaders = shaders.length
            }

            // TODO move this to renderer core
            renderer.renderer.info.reset()
        },
)
