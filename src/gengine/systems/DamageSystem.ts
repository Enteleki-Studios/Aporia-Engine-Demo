import { System, ECSFilter } from '../ECS'
import {
    DamagingComponent,
    HealthComponent,
    HitboxComponent,
    PositionComponent,
} from '../components'

export class DamageSystem extends System {
    damagingFilter = new ECSFilter([PositionComponent, DamagingComponent])
    damagableFilter = new ECSFilter([PositionComponent, HealthComponent, HitboxComponent])

    filters = [this.damagingFilter, this.damagableFilter]

    tick() {
        this.damagingFilter.entities.forEach((damagingEntity) => {
            const damagingPosition = damagingEntity.get(PositionComponent)
            this.damagableFilter.entities.forEach((targetEntity) => {
                if (damagingEntity.id === targetEntity.id) {
                    return
                }

                const targetPosition = targetEntity.get(PositionComponent)
                if (damagingPosition.position.distanceTo(targetPosition.position) < 2) {
                    const targetHealth = targetEntity.get(HealthComponent)
                    if (targetHealth.health) {
                        targetHealth.health -= 1
                        console.debug(targetHealth.health)
                    }
                    // console.debug(targetEntity.get(HealthComponent).healts)
                }
            })
        })
    }
}
