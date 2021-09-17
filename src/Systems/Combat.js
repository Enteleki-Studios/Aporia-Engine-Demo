import logger from 'utils/logger'
import System from 'ECS/System'
import { ATTACK, HEALTH, INPUT, POSITION } from 'Components/types'

export class Combat extends System {
    tick(delta) {
        const bodies = this.ECS.ComponentManager.getTuplesByQuery([HEALTH, POSITION])

        this.ECS.ComponentManager.getTuplesByQuery([ATTACK, INPUT, POSITION]).forEach(
            ([attackComponent, inputComponent, attackerPositionComponent]) => {
                if (inputComponent.attacking) {
                    let dealingDamage = false

                    if (attackComponent.delta > attackComponent.spoolUp) {
                        if (!attackComponent.hasDealtDamage) {
                            dealingDamage = true
                            attackComponent.hasDealtDamage = true
                        } else if (attackComponent.delta > attackComponent.spoolUp + attackComponent.coolDown) {
                            // Reset after the cooldown
                            attackComponent.delta = 0
                            attackComponent.hasDealtDamage = false
                        }
                    }

                    bodies.forEach(([healthComponent, defenderPositionComponent]) => {
                        if (attackComponent.entity === healthComponent.entity) {
                            // Don't attack ourselves
                            return
                        }

                        const { position: atkPos } = attackerPositionComponent
                        const { position: defPos } = defenderPositionComponent
                        if (atkPos.distanceTo(defPos) <= attackComponent.range) {
                            logger.debug('COMBAT', healthComponent.entity, healthComponent.health)
                            if (dealingDamage) { // TODO move this up so we have fewer loops
                                healthComponent.health -= attackComponent.damage
                            }
                        }
                    })

                    attackComponent.delta += delta * 1000
                } else {
                    attackComponent.delta = 0
                }
            },
        )
    }
}
