import type { DirectionalLightComponent, PositionComponent, ComponentManager } from 'gengine'

export function sunSystem(componentManager: ComponentManager) {
    componentManager.getTuplesByQueryGeneric<[DirectionalLightComponent, PositionComponent]>(
        ['directionalLight', 'position'],
    ).forEach(([directionalLightComponent, positionComponent]) => {
        directionalLightComponent.position.set(
            positionComponent.position.x + 10,
            15,
            positionComponent.position.z + 10,
        )
        directionalLightComponent.target.copy(positionComponent.position)
    })
}
