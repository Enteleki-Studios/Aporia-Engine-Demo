import { type Plugin, type PluginsToResources } from '@core'

import { Transform3DComponent } from '@core/components'

import type {
    Collider,
    KinematicCharacterController,
    RigidBody,
    World,
} from '@dimforge/rapier3d'
import { EntityId, type PluginEntities, createQuery } from '@pluginEntities'

import { shapeToColliderDesc } from './colliderUtils'
import {
    ColliderComponent,
    RigidBodyDynamic,
    RigidBodyFixed,
    RigidBodyKinematic,
} from './components'

export * from './components'

export type PluginRapier3D = ReturnType<typeof pluginRapier3D>

export type Rapier = typeof import('@dimforge/rapier3d')

const GRAVITY_3D = { x: 0, y: -9.81, z: 0 }

type Provides = {
    physics: {
        rapier: Rapier
        world: World
        characterController: KinematicCharacterController
        bodies: Map<EntityId, RigidBody>
        colliders: Map<EntityId, Collider>
    }
}

type Dependencies = PluginsToResources<[PluginEntities]>

const dynamicBodiesQuery = createQuery([
    ColliderComponent,
    Transform3DComponent,
    RigidBodyDynamic,
])

const fixedBodiesQuery = createQuery([
    ColliderComponent,
    Transform3DComponent,
    RigidBodyFixed,
])

const kinematicBodiesQuery = createQuery([
    ColliderComponent,
    Transform3DComponent,
    RigidBodyKinematic,
])

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
        characterController.setMaxSlopeClimbAngle(60 * (Math.PI / 180))
        characterController.setMinSlopeSlideAngle(70 * (Math.PI / 180))
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
        const { world: physicsWorld, rapier, bodies, colliders } = world.resources.physics

        world.addSystem(() => {
            world.resources.physics.world.timestep = world.clock.delta
            world.resources.physics.world.step()
        })

        world.addSystem(() => {
            world.resources.entities
                .query(dynamicBodiesQuery)
                .forEach(([[_, transform], entity]) => {
                    const body = world.resources.physics.bodies.get(entity.id)

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
            world.resources.entities
                .query(kinematicBodiesQuery)
                .forEach(([[_, transform], entity]) => {
                    const body = world.resources.physics.bodies.get(entity.id)

                    if (body) {
                        const position = body.translation()
                        transform.position[0] = position.x
                        transform.position[1] = position.y
                        transform.position[2] = position.z
                    }
                })
        })

        world.resources.entities.addQueryEffect(
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

        world.resources.entities.addQueryEffect(
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

        world.resources.entities.addQueryEffect(
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
