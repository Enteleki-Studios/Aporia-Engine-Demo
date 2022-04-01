import { System } from '../ECS/System'
import { POSITION, VELOCITY } from '../components/componentTypes'
import type { PositionComponent } from '../components/PositionComponent'
import type { VelocityComponent } from '../components/VelocityComponent'

export class MovementSystem extends System {
    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([POSITION, VELOCITY]).forEach((tuple) => {
            const [positionComponent, velocityComponent] = tuple as [PositionComponent, VelocityComponent]
            positionComponent.position.add(velocityComponent.velocity)
        })
    }
}
