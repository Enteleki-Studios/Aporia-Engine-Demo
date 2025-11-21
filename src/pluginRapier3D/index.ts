import { type Plugin, type PluginsToResources } from '@core'

import { Geometry3DComponent, Transform3DComponent } from '@core/components'

import type { KinematicCharacterController, RigidBody, World } from '@dimforge/rapier3d'
import { EntityId, type PluginEntities, createQuery } from '@pluginEntities'

import { RigidBodyDynamic, RigidBodyFixed } from './components'

export * from './components'

type Rapier = typeof import('@dimforge/rapier3d')

const GRAVITY_3D = { x: 0, y: -9.81, z: 0 }

type Provides = {
    physics: {
        rapier: Rapier
        world: World
        characterController: KinematicCharacterController
        dynamicBodies: Map<EntityId, RigidBody>
    }
}

type Dependencies = PluginsToResources<[PluginEntities]>

const dynamicBodiesQuery = createQuery([Transform3DComponent, RigidBodyDynamic])
const fixedBodiesQuery = createQuery([
    Geometry3DComponent,
    Transform3DComponent,
    RigidBodyFixed,
])

export const pluginRapier3D = (): Plugin<Provides, Dependencies> => ({
    createResources: async () => {
        const rapier = await import('@dimforge/rapier3d')

        const world = new rapier.World(GRAVITY_3D)
        const dynamicBodies = new Map<EntityId, RigidBody>()

        // TODO: Add support for multiple character controllers
        const characterController = world.createCharacterController(0.01)
        characterController.enableSnapToGround(0.5)
        characterController.enableAutostep(0.5, 0.2, true)
        characterController.setMaxSlopeClimbAngle(45 * (Math.PI / 180))
        characterController.setMinSlopeSlideAngle(30 * (Math.PI / 180))
        characterController.setApplyImpulsesToDynamicBodies(true)

        return {
            physics: {
                rapier,
                world,
                characterController,
                dynamicBodies,
            },
        }
    },
    init(runtime) {
        const { world: physicsWorld, rapier } = runtime.resources.physics

        runtime.addSystem((world) => {
            world.resources.physics.world.timestep = world.clock.delta
            world.resources.physics.world.step()
        })

        runtime.addSystem((world) => {
            world.resources.entities
                .query(dynamicBodiesQuery)
                .forEach(([[transform], entity]) => {
                    const body = world.resources.physics.dynamicBodies.get(entity.id)

                    if (body) {
                        const position = body.translation()
                        const rotation = body.rotation()

                        transform.position[0] = position.x
                        transform.position[1] = position.y
                        transform.position[2] = position.z

                        transform.rotation[0] = rotation.x
                        transform.rotation[1] = rotation.y
                        transform.rotation[2] = rotation.z
                        transform.rotation[3] = rotation.w
                    }
                })
        })

        runtime.resources.entities.addQueryObserver(
            dynamicBodiesQuery,
            ([[transform], entity]) => {
                const colliderDesc = rapier.ColliderDesc.ball(0.5)
                const rigidBody = physicsWorld.createRigidBody(
                    rapier.RigidBodyDesc.dynamic().setTranslation(...transform.position),
                )
                physicsWorld.createCollider(colliderDesc, rigidBody)
                runtime.resources.physics.dynamicBodies.set(entity.id, rigidBody)
            },
        )

        runtime.resources.entities.addQueryObserver(
            fixedBodiesQuery,
            ([[geometryDef, transform]]) => {
                if (geometryDef.type === 'heightfield') {
                    const { ncols, nrows, heights, scale } = geometryDef
                    const colliderDesc = rapier.ColliderDesc.heightfield(
                        nrows,
                        ncols,
                        new Float32Array(heights),
                        { x: scale[0], y: scale[1], z: scale[2] },
                    )
                    const rigidBody = physicsWorld.createRigidBody(
                        rapier.RigidBodyDesc.fixed().setTranslation(
                            ...transform.position,
                        ),
                    )
                    physicsWorld.createCollider(colliderDesc, rigidBody)
                }
            },
        )
    },
})
