import { ECSFilter } from '../ECS/ECSFilter'
import { System } from '../ECS/System'
import { World } from '../World'
import { PositionComponent } from '../components/PositionComponent'
import { VelocityComponent } from '../components/VelocityComponent'

export class ApplyVelocitySystem extends System {
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
