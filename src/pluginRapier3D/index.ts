import { type Plugin } from '@core'

import type { KinematicCharacterController, World } from '@dimforge/rapier3d'

export * from './components'

type Rapier = typeof import('@dimforge/rapier3d')

const GRAVITY_3D = { x: 0, y: -9.81, z: 0 }

type Provides = {
    physics: {
        rapier: Rapier
        world: World
        characterController: KinematicCharacterController
    }
}

export const pluginRapier3D = (): Plugin<Provides> => ({
    createResources: async () => {
        const rapier = await import('@dimforge/rapier3d')

        const world = new rapier.World(GRAVITY_3D)

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
            },
        }
    },
    init(runtime) {
        const { world: physicsWorld, rapier } = runtime.resources.physics

        runtime.addSystem((world) => {
            world.resources.physics.world.timestep = world.clock.delta
            world.resources.physics.world.step()
        })

        const generateHeightfield = (ncols: number, nrows: number = ncols) => {
            const heights = []

            for (let i = 0; i <= ncols; ++i) {
                for (let j = 0; j <= nrows; ++j) {
                    heights.push(Math.random())
                }
            }

            return heights
        }
        const subdivs = 10
        const scaleInt = 70
        const scale = { x: scaleInt, y: 5, z: scaleInt }
        const colliderDesc = rapier.ColliderDesc.heightfield(
            subdivs,
            subdivs,
            new Float32Array(generateHeightfield(subdivs)),
            scale,
        )
        const rigidBody = physicsWorld.createRigidBody(rapier.RigidBodyDesc.fixed())
        physicsWorld.createCollider(colliderDesc, rigidBody)

        const ballDesc = rapier.ColliderDesc.ball(0.5)
        const ballBody = physicsWorld.createRigidBody(
            rapier.RigidBodyDesc.dynamic().setTranslation(0.0, 10.0, 0.0),
        )
        physicsWorld.createCollider(ballDesc, ballBody)
    },
})
