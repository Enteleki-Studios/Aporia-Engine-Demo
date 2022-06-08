import type { ComponentManager } from '../managers/ComponentManager'
import { DirectionalLightComponent } from '../components/DirectionalLightComponent'
import { PositionComponent } from '../components/PositionComponent'
import { SunTargetComponent } from '../components/SunTargetComponent'

export function sunSystem(componentManager: ComponentManager) {
    const directionalLightComponent = componentManager.getTuplesByClass(DirectionalLightComponent)[0][0]

    componentManager.getTuplesByClass(
        PositionComponent,
        SunTargetComponent,
    ).forEach(([positionComponent]) => {
        directionalLightComponent.position.set(
            positionComponent.position.x + directionalLightComponent.offset[0],
            directionalLightComponent.offset[1],
            positionComponent.position.z + directionalLightComponent.offset[2],
        )
        directionalLightComponent.target.copy(positionComponent.position)
    })
}
