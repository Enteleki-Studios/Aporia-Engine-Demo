import { Vec3 } from 'gl-matrix/dist/esm'

import type { World } from 'World'
import { ECSFilter, createSystem } from 'ecs'
import { directionalLightComponent, positionComponent, tags } from '../components'

export const directionalLightFilter = ECSFilter.of([directionalLightComponent])
export const sunTargetFilter = ECSFilter.of([positionComponent], [tags.sunTarget])

export const sunSystem = createSystem('sun', () => (world: World) => {
    world.ecs.filterBy(sunTargetFilter).forEach((targetEntity) => {
        const { position: targetPosition } = targetEntity.get(positionComponent)

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
