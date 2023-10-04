import { ECSFilter, System, Entity } from 'ecs'
import { World } from 'World'
import { emitterComponent, positionComponent } from 'components'

export class EmitterSystem implements System {
    emitterFilter = new ECSFilter([emitterComponent, positionComponent])
    timeSinceLastTrigger = 0
    prefabs: Record<string, undefined | (() => Entity)>

    filters = [this.emitterFilter]

    constructor(prefabs: Record<string, undefined | (() => Entity)>) {
        this.prefabs = prefabs
    }

    tick(world: World) {
        this.timeSinceLastTrigger += world.timeElapsedS

        if (this.timeSinceLastTrigger >= 2) {
            this.emitterFilter.entities.forEach((entity) => {
                const { position } = entity.get(positionComponent)
                const { prefabId } = entity.get(emitterComponent)

                const newEntity = this.prefabs[prefabId]?.()
                if (newEntity) {
                    // TODO can't assume that this entity has or wants a position
                    newEntity.get(positionComponent).position = [...position]
                    world.ecs.registerEntity(newEntity)
                }
            })

            this.timeSinceLastTrigger = 0
        }
    }
}
