import { ECSFilter, System, Entity } from 'ecs'
import { World } from 'World'
import { EmitterComponent, PositionComponent } from 'components'

export class EmitterSystem implements System {
    emitterFilter = new ECSFilter([EmitterComponent, PositionComponent])
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
                const { position } = entity.get(PositionComponent)
                const { prefabId } = entity.get(EmitterComponent)

                const newEntity = this.prefabs[prefabId]?.()
                if (newEntity) {
                    // TODO can't assume that this entity has or wants a position
                    newEntity.get(PositionComponent).position = [...position]
                    world.ecs.registerEntity(newEntity)
                }
            })

            this.timeSinceLastTrigger = 0
        }
    }
}
