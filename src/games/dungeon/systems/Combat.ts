import { Vector3 } from 'three'
import { System, HealthComponent } from 'gengine'
import { ATTACK, INPUT, POSITION } from 'components/types'
import type { AttackComponent, InputComponent, PositionComponent } from 'components'

export class Combat extends System {
    tick(delta:number) {
        const bodies = this.ECS.ComponentManager.getTuplesByQuery(
            ['HEALTH', POSITION],
        ) as [HealthComponent, PositionComponent][]

        this.ECS.ComponentManager.getTuplesByQuery([ATTACK, INPUT, POSITION]).forEach((tuple) => {
            type tupleType = [AttackComponent, InputComponent, PositionComponent]
            const [attackComponent, inputComponent, attackerPositionComponent] = tuple as tupleType
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
                        if (attackComponent.entityId === healthComponent.entityId) {
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
        })
    }
}
