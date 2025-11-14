import { emitterComponent, transform3D } from '~/components'
import { ECSFilter, Entity, type World, createSystem } from '~/core'

export const emitterFilter = new ECSFilter([emitterComponent, transform3D])

export const emitterSystem = createSystem<{
    prefabs: Record<string, undefined | (() => Entity)>
}>('emitter', ({ prefabs }) => (world: World) => {
    for (const entity of world.ecs.filterBy(emitterFilter)) {
        const { position } = entity.get(transform3D)
        const emitter = entity.get(emitterComponent)
        const { prefabId, delay, elapsed } = emitter

        if (elapsed >= delay) {
            emitter.elapsed = 0

            const newEntity = prefabs[prefabId]?.()
            if (newEntity) {
                // TODO can't assume that this entity has or wants a position
                newEntity.get(transform3D).position = [...position]
                world.ecs.addEntity(newEntity)
            }
        } else {
            emitter.elapsed += world.timeElapsedS
        }
    }
})
