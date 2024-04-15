import { Vec3 } from 'gl-matrix'

import { ECSFilter, createSystem, type World } from 'core'
import { directionalLightComponent, transform3D, tags } from '../components'

export const directionalLightFilter = ECSFilter.of([directionalLightComponent])
export const sunTargetFilter = ECSFilter.of([transform3D], [tags.sunTarget])

export const sunSystem = createSystem('sun', () => (world: World) => {
    world.ecs.filterBy(sunTargetFilter).forEach((targetEntity) => {
        const { position: targetPosition } = targetEntity.get(transform3D)

        world.ecs.filterBy(directionalLightFilter).forEach((sunEntity) => {
            const {
                position: sunPosition,
                offset: sunOffset,
                target: sunTarget,
            } = sunEntity.get(directionalLightComponent)

            Vec3.set(sunPosition, targetPosition[0] + sunOffset[0], sunOffset[1], targetPosition[2] + sunOffset[2])

            Vec3.copy(sunTarget, targetPosition)
        })
    })
})
