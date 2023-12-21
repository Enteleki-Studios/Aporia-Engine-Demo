import { Group, Object3D } from 'three'

import { createSystem, World } from 'core'
import { ResourceManager } from 'managers/ResourceManager'
import {
    cameraFilter,
    movingEntitiesFilter,
    rotatingEntitiesFilter,
} from 'filters'

import {
    cameraComponent,
    positionComponent,
    directionComponent,
} from 'components'

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
                // if (!entity.hasTag(tags.hero)) {
                const { position } = entity.get(positionComponent)
                const { direction } = entity.get(directionComponent)

                objectManager
                    .getContainer(entity.id)
                    ?.lookAt(position[0] + direction[0], position[1] + direction[1], position[2] + direction[2])
                // }
            })

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
