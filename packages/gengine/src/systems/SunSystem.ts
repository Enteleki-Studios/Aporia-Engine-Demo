import { ECSFilter, System } from '../ecs'
import { DirectionalLightComponent, PositionComponent, SunTargetComponent } from '../components'

export class SunSystem implements System {
    directionalLightFilter = new ECSFilter([DirectionalLightComponent])
    targetFilter = new ECSFilter([PositionComponent, SunTargetComponent])

    filters = [this.directionalLightFilter, this.targetFilter]

    tick() {
        const [sunEntity] = this.directionalLightFilter.entities
        const directionalLightComponent = sunEntity.get(DirectionalLightComponent)

        this.targetFilter.entities.forEach((targetEntity) => {
            const positionComponent = targetEntity.get(PositionComponent)

            directionalLightComponent.position.set(
                positionComponent.position[0] + directionalLightComponent.offset[0],
                directionalLightComponent.offset[1],
                positionComponent.position[2] + directionalLightComponent.offset[2],
            )
            directionalLightComponent.target.fromArray(positionComponent.position)
        })
    }
}
