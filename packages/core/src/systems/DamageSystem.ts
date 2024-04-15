import { Vec3 } from 'gl-matrix'

import { ECSFilter, createSystem, type World } from 'core'
import { damagingComponent, healthComponent, hitboxComponent, transform3D } from 'components'

export const damagingFilter = new ECSFilter([transform3D, damagingComponent])
export const damagableFilter = new ECSFilter([transform3D, healthComponent, hitboxComponent])

export const damageSystem = createSystem('damage', () => (world: World) => {
    for (const damagingEntity of world.ecs.filterBy(damagingFilter)) {
        const damagingPosition = damagingEntity.get(transform3D)
        const damageComponent = damagingEntity.get(damagingComponent)

        damageComponent.delta += world.timeElapsedS

        if (damageComponent.stage === 'spooling' && damageComponent.delta > damageComponent.spoolUp) {
            damageComponent.stage = 'cooling'

            for (const targetEntity of world.ecs.filterBy(damagableFilter)) {
                if (damagingEntity.id === targetEntity.id) {
                    return
                }

                const targetPosition = targetEntity.get(transform3D)
                const targetHitbox = targetEntity.get(hitboxComponent)

                const maxDistance = damageComponent.radius + targetHitbox.radius
                if (Vec3.distance(damagingPosition.position, targetPosition.position) < maxDistance) {
                    const targetHealth = targetEntity.get(healthComponent)
                    if (targetHealth.health) {
                        targetHealth.health -= Math.min(damageComponent.damage, targetHealth.health)
                    }
                }
            }
        } else if (damageComponent.stage === 'cooling' && damageComponent.delta > damageComponent.coolDown) {
            damageComponent.stage = 'spooling'
            damageComponent.delta = 0

            // TODO Refactor so that attacks are active/inactive depending on conditions
            // Melee is while attacking
            // Grenades are all the time
            // Passive effects while in range
        }
    }
})
