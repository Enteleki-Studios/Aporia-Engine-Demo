import { ECSFilter, System } from '../ecs'
import { World } from '../World'
import { PositionComponent, VelocityComponent } from '../components'

export class ApplyVelocitySystem implements System {
    movingFilter = new ECSFilter([PositionComponent, VelocityComponent])

    filters = [this.movingFilter]

    tick(world: World) {
        this.movingFilter.entities.forEach((entity) => {
            const { position } = entity.get(PositionComponent)
            const { velocity } = entity.get(VelocityComponent)

            position.addScaledVector(velocity, world.timeElapsedS)
        })
    }
}
