import { Vector3 } from 'three'
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

                    if (dealingDamage) {
                        bodies.forEach(([healthComponent, defenderPositionComponent]) => {
                            if (attackComponent.entity === healthComponent.entity) {
                                // Don't attack ourselves
                                return
                            }

                            const { position: atkPos, rotation } = attackerPositionComponent
                            const { position: defPos } = defenderPositionComponent

                            const rangeVector = defPos.clone().sub(atkPos)
                            const rotationVector = new Vector3(0, 0, 1).applyQuaternion(rotation)

                            const isInRange = rangeVector.length() <= attackComponent.range
                            const isInFront = rotationVector.angleTo(rangeVector) <= Math.PI / 4

                            if (isInRange && isInFront) {
                                healthComponent.health -= attackComponent.damage
                            }
                        })
                    }

                    attackComponent.delta += delta * 1000
                } else {
                    attackComponent.delta = 0
                }
            },
        )
    }
}
