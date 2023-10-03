import { Vec3 } from 'gl-matrix/dist/esm'
import { World } from '../World'
import { System, ECSFilter } from '../ecs'
import { damagingComponent, healthComponent, hitboxComponent, positionComponent } from '../components'

export class DamageSystem implements System {
    damagingFilter = new ECSFilter([positionComponent, damagingComponent])
    damagableFilter = new ECSFilter([positionComponent, healthComponent, hitboxComponent])

    filters = [this.damagingFilter, this.damagableFilter]

    tick(world: World) {
        this.damagingFilter.entities.forEach((damagingEntity) => {
            const damagingPosition = damagingEntity.get(positionComponent)
            const damageComponent = damagingEntity.get(damagingComponent)

            damageComponent.delta += world.timeElapsedS

            if (damageComponent.stage === 'spooling' && damageComponent.delta > damageComponent.spoolUp) {
                damageComponent.stage = 'cooling'

                this.damagableFilter.entities.forEach((targetEntity) => {
                    if (damagingEntity.id === targetEntity.id) {
                        return
                    }

                    const targetPosition = targetEntity.get(positionComponent)
                    const targetHitbox = targetEntity.get(hitboxComponent)

                    const maxDistance = damageComponent.radius + targetHitbox.radius
                    if (Vec3.distance(damagingPosition.position, targetPosition.position) < maxDistance) {
                        const targetHealth = targetEntity.get(healthComponent)
                        if (targetHealth.health) {
                            targetHealth.health -= Math.min(damageComponent.damage, targetHealth.health)
                        }
                    }
                })
            } else if (damageComponent.stage === 'cooling' && damageComponent.delta > damageComponent.coolDown) {
                damageComponent.stage = 'spooling'
                damageComponent.delta = 0

                // TODO Refactor so that attacks are active/inactive depending on conditions
                // Melee is while attacking
                // Grenades are all the time
                // Passive effects while in range
            }
        })
    }
}
