import { Vec3 } from 'cannon-es'
import { World, createSystem } from '@gengine/core'

import { CannonPhysicsPlugin, physicsBodyQuery, physicsExtVelocityFilter } from '.'
import { transform3D, velocityComponent } from '@gengine/core'

export const physicsSystem = createSystem('physics', () => {
    const scratchEuler = new Vec3()

    return (world: World) => {
        const { physicsWorld, physicsBodyByEntityId } = world.getPlugin(CannonPhysicsPlugin)

        for (const entity of world.ecs.filterBy(physicsExtVelocityFilter)) {
            const body = physicsBodyByEntityId.get(entity.id)

            if (body) {
                const { velocity } = entity.get(velocityComponent)

                body.velocity.x = velocity[0]
                body.velocity.y = velocity[1]
                body.velocity.z = velocity[2]
            }
        }

        physicsWorld.fixedStep()

        for (const entity of world.ecs.filterBy(physicsBodyQuery)) {
            const body = physicsBodyByEntityId.get(entity.id)

            if (body) {
                const { position, rotation } = entity.get(transform3D)

                position[0] = body.interpolatedPosition.x
                position[1] = body.interpolatedPosition.y
                position[2] = body.interpolatedPosition.z

                body.interpolatedQuaternion.toEuler(scratchEuler)

                rotation[0] = scratchEuler.x
                rotation[1] = scratchEuler.y
                rotation[2] = scratchEuler.z

                if (entity.has(velocityComponent)) {
                    const { velocity } = entity.get(velocityComponent)

                    velocity[0] = body.velocity.x
                    velocity[1] = body.velocity.y
                    velocity[2] = body.velocity.z
                }
            }
        }

        world.stats.systemsStats['physics'].extra.bodies = physicsWorld.bodies.length
    }
})
