import { World } from '../World'
import { System, ECSFilter } from '../ecs'
import { DamagingComponent, HealthComponent, HitboxComponent, PositionComponent } from '../components'

export class DamageSystem implements System {
    damagingFilter = new ECSFilter([PositionComponent, DamagingComponent])
    damagableFilter = new ECSFilter([PositionComponent, HealthComponent, HitboxComponent])

    filters = [this.damagingFilter, this.damagableFilter]

    tick(world: World) {
        this.damagingFilter.entities.forEach((damagingEntity) => {
            const damagingPosition = damagingEntity.get(PositionComponent)
            const damageComponent = damagingEntity.get(DamagingComponent)

            damageComponent.delta += world.timeElapsedS

            if (damageComponent.stage === 'spooling' && damageComponent.delta > damageComponent.spoolUp) {
                damageComponent.stage = 'cooling'

                this.damagableFilter.entities.forEach((targetEntity) => {
                    if (damagingEntity.id === targetEntity.id) {
                        return
                    }

                    const targetPosition = targetEntity.get(PositionComponent)
                    const targetHitbox = targetEntity.get(HitboxComponent)

                    const maxDistance = damageComponent.radius + targetHitbox.radius
                    if (damagingPosition.position.distanceTo(targetPosition.position) < maxDistance) {
                        const targetHealth = targetEntity.get(HealthComponent)
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
