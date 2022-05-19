import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'
import { ComponentManager } from '../managers/ComponentManager'

export function applyVelocitySystem(delta: number, componentManager: ComponentManager) {
    componentManager.getTuplesByClass(
        PositionComponent,
        VelocityComponent,
    ).forEach(([positionComponent, velocityComponent]) => {
        positionComponent.position.add(velocityComponent.velocity.clone().multiplyScalar(delta))
    })
}
