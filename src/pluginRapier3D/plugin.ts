import type {
    Collider,
    KinematicCharacterController,
    RigidBody,
    World,
} from '@dimforge/rapier3d'
import {
    type Plugin,
    type PluginsToResources,
} from '@enteleki-studios/aporia-engine-core'
import { degToRad } from '@enteleki-studios/aporia-engine-core/utils'
import type { PluginClock } from '@pluginClock'
import { EntityId, type PluginEntities } from '@pluginEntities'

import { GRAVITY_3D, type Rapier } from '.'
import { shapeToColliderDesc } from './colliderUtils'
import { dynamicBodiesQuery, fixedBodiesQuery, kinematicBodiesQuery } from './queries'

type Provides = {
    physics: {
        rapier: Rapier
        world: World
        characterController: KinematicCharacterController
        bodies: Map<EntityId, RigidBody>
        colliders: Map<EntityId, Collider>
    }
}

type Dependencies = PluginsToResources<[PluginClock, PluginEntities]>

export type PluginRapier3D = ReturnType<typeof pluginRapier3D>

export const pluginRapier3D = (): Plugin<Provides, Dependencies> => ({
    createResources: async () => {
        const rapier = await import('@dimforge/rapier3d')

        const world = new rapier.World(GRAVITY_3D)
        const bodies = new Map<EntityId, RigidBody>()
        const colliders = new Map<EntityId, Collider>()

        // TODO: Add support for multiple character controllers
        const characterController = world.createCharacterController(0.01)
        characterController.enableSnapToGround(0.5)
        characterController.enableAutostep(0.5, 0.2, true)
        characterController.setMaxSlopeClimbAngle(degToRad(45))
        characterController.setMinSlopeSlideAngle(degToRad(50))
        characterController.setApplyImpulsesToDynamicBodies(true)

        return {
            physics: {
                rapier,
                world,
                characterController,
                bodies,
                colliders,
            },
        }
    },
    init(world) {
        const { world: physicsWorld, rapier, bodies, colliders } = world.physics

        world.runtime.addSystem(() => {
            world.physics.world.timestep = world.clock.delta
            world.physics.world.step()
        })

        world.runtime.addSystem(() => {
            world.entities
                .query(dynamicBodiesQuery)
                .forEach(([[_, transform], entity]) => {
                    const body = world.physics.bodies.get(entity.id)

                    if (body) {
                        const position = body.translation()
                        transform.position[0] = position.x
                        transform.position[1] = position.y
                        transform.position[2] = position.z

                        const rotation = body.rotation()
                        transform.rotation[0] = rotation.x
                        transform.rotation[1] = rotation.y
                        transform.rotation[2] = rotation.z
                        transform.rotation[3] = rotation.w
                    }
                })

            // TODO: Move functionality to a function...
            world.entities
                .query(kinematicBodiesQuery)
                .forEach(([[_, transform], entity]) => {
                    const body = world.physics.bodies.get(entity.id)

                    if (body) {
                        const position = body.translation()
                        transform.position[0] = position.x
                        transform.position[1] = position.y
                        transform.position[2] = position.z
                    }
                })
        })

        world.entities.addQueryEffect(
            dynamicBodiesQuery,
            ([[colliderDef, transform], entity]) => {
                const { shape } = colliderDef
                const colliderDesc = shapeToColliderDesc(shape, rapier)

                const rigidBody = physicsWorld.createRigidBody(
                    rapier.RigidBodyDesc.dynamic().setTranslation(...transform.position),
                )

                const collider = physicsWorld.createCollider(colliderDesc, rigidBody)

                bodies.set(entity.id, rigidBody)
                colliders.set(entity.id, collider)
            },
        )

        world.entities.addQueryEffect(
            fixedBodiesQuery,
            ([[colliderDef, transform], entity]) => {
                const { shape } = colliderDef
                const colliderDesc = shapeToColliderDesc(shape, rapier)

                const rigidBody = physicsWorld.createRigidBody(
                    rapier.RigidBodyDesc.fixed().setTranslation(...transform.position),
                )

                const collider = physicsWorld.createCollider(colliderDesc, rigidBody)

                bodies.set(entity.id, rigidBody)
                colliders.set(entity.id, collider)
            },
        )

        world.entities.addQueryEffect(
            kinematicBodiesQuery,
            ([[colliderDef, transform], entity]) => {
                const { shape } = colliderDef
                const colliderDesc = shapeToColliderDesc(shape, rapier)

                const rigidBody = physicsWorld.createRigidBody(
                    rapier.RigidBodyDesc.kinematicPositionBased()
                        .setTranslation(...transform.position)
                        .lockRotations(),
                )

                const collider = physicsWorld.createCollider(colliderDesc, rigidBody)

                bodies.set(entity.id, rigidBody)
                colliders.set(entity.id, collider)
            },
        )
    },
})
