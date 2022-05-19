import type { ComponentManager } from 'gengine'
import { DirectionalLightComponent, PositionComponent } from 'gengine'

export function sunSystem(componentManager: ComponentManager) {
    componentManager.getTuplesByClass(
        DirectionalLightComponent,
        PositionComponent,
    ).forEach(([directionalLightComponent, positionComponent]) => {
        directionalLightComponent.position.set(
            positionComponent.position.x + 10,
            15,
            positionComponent.position.z + 10,
        )
        directionalLightComponent.target.copy(positionComponent.position)
    })
}
