import { ECSFilter, System } from '../ecs'
import { World } from '../World'
import {
    BasicGeometryComponent,
    EmitterComponent,
    PositionComponent,
    VelocityComponent,
} from '../components'

export class EmitterSystem extends System {
    emitterFilter = new ECSFilter([EmitterComponent, PositionComponent])
    timeSinceLastTrigger = 0

    filters = [this.emitterFilter]

    tick(world: World) {
        this.timeSinceLastTrigger += world.timeElapsedS

        if (this.timeSinceLastTrigger >= 5) {
            this.emitterFilter.entities.forEach((entity) => {
                const { position } = entity.get(PositionComponent)

                world.ecs.createEntity().addComponents(
                    new BasicGeometryComponent({ geometryType: 'box', radius: 0.25 }),
                    new PositionComponent({ position: position.toArray() }),
                    new VelocityComponent({ velocity: [-2, 0, 0] }),
                )
            })

            this.timeSinceLastTrigger = 0
        }
    }
}
