import { type World, ECSFilter, Entity, createSystem } from 'core'
import { emitterComponent, positionComponent } from 'components'

export const emitterFilter = new ECSFilter([emitterComponent, positionComponent])

export const emitterSystem = createSystem<{ prefabs: Record<string, undefined | (() => Entity)> }>(
    'emitter',
    ({ prefabs }) =>
        (world: World) => {
            world.ecs.filterBy(emitterFilter).forEach((entity) => {
                const { position } = entity.get(positionComponent)
                const emitter = entity.get(emitterComponent)
                const { prefabId, delay, elapsed } = emitter

                if (elapsed >= delay) {
                    emitter.elapsed = 0

                    const newEntity = prefabs[prefabId]?.()
                    if (newEntity) {
                        // TODO can't assume that this entity has or wants a position
                        newEntity.get(positionComponent).position = [...position]
                        world.ecs.registerEntity(newEntity)
                    }
                } else {
                    emitter.elapsed += world.timeElapsedS
                }
            })
        },
)
