import { Vector3 } from 'three'
import { quat, vec3 } from 'gl-matrix'

import {
    Geometry3DComponent,
    PlayerComponent,
    Transform3DComponent,
} from '@core/components'

import { createQuery } from '@pluginEntities'
import { RigidBodyDynamic, RigidBodyFixed, RigidBodyKinematic } from '@pluginRapier3D'
import { Animation, GltfComponent, RenderableDynamic } from '@pluginThree'

import { type World, createWorld } from './createWorld'
import { glMatrix } from 'gl-matrix'
import { Y_AXIS } from '@core'

const playerQuery = createQuery([PlayerComponent, Transform3DComponent, Animation])

const playerMovementSystem = (world: World) => {
    const { input } = world.resources
    const entities = world.resources.entities.query(playerQuery)
    const { characterController, bodies, colliders } = world.resources.physics

    entities.forEach(([[_, transform, animation], entity]) => {
        const dirX = input.left ? -1 : input.right ? 1 : 0
        const dirZ = input.up ? -1 : input.down ? 1 : 0

        const character = bodies.get(entity.id)
        const characterCollider = colliders.get(entity.id)

        if (character && characterCollider) {
            const speed = input.shift ? 7 : 1.25

            const isGrounded = characterController.computedGrounded()

            const velocity: vec3 = [
                dirX,
                0,
                dirZ,
            ]

            vec3.normalize(velocity, velocity)
            vec3.scale(velocity, velocity, speed * world.clock.delta)

            velocity[1] = input.space
                    ? 10 * world.clock.delta
                    : isGrounded
                      ? -0.01
                      : -9.81 * world.clock.delta

            characterController.computeColliderMovement(
                characterCollider,
                {
                    x: velocity[0],
                    y: velocity[1],
                    z: velocity[2],
                },
            )

            const movement = characterController.computedMovement()
            const newPos = character.translation()
            newPos.x += movement.x
            newPos.y += movement.y
            newPos.z += movement.z
            character.setNextKinematicTranslation(newPos)

            // transform.position[0] = newPos.x
            // transform.position[1] = newPos.y
            // transform.position[2] = newPos.z

            if (!isGrounded) {
                animation.actionName = 'Jump_Loop'
            } else if (dirX || dirZ) {
                if (input.shift) {
                    animation.actionName = 'Jog_Fwd_Loop'
                } else {
                    animation.actionName = 'Walk_Loop'
                }
            } else {
                animation.actionName = 'Idle_Loop'
            }

            // TODO: Don't create this every frame...
            const moveCamera = () => {
                world.resources.three.renderer.camera.position.set(
                    transform.position[0],
                    transform.position[1] + 8,
                    transform.position[2] + 15,
                )
                world.resources.three.renderer.camera.lookAt(new Vector3(
                    transform.position[0],
                    transform.position[1] + 2,
                    transform.position[2],
                ))
            }

            if (dirX || dirZ) {
                const angle = Math.atan2(dirX, dirZ)
                const t = 10 * world.clock.delta
                const targetQ = quat.setAxisAngle([0, 0, 0, 1], Y_AXIS, angle)
                quat.slerp(transform.rotation, transform.rotation, targetQ, t)

                moveCamera()
            }

            if (transform.position[1] < -30) {
                character.setNextKinematicTranslation({
                    x: 0,
                    y: 10,
                    z: 0,
                })
            }
        }
    })
}

export const game1 = async () => {
    glMatrix.setMatrixArrayType(Array)

    const world = await createWorld()

    world.addSystem(playerMovementSystem)

    // Create player
    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        PlayerComponent(),
        RigidBodyKinematic(),
        Geometry3DComponent({
            type: 'capsule',
            halfHeight: 0.5,
            radius: 0.4,
        }),
        Transform3DComponent({ position: [-3, 10, 0] }),
        RenderableDynamic(),
        GltfComponent({
            path: '/humanoid/animated_robo.glb',
        }),
        Animation({ actionName: 'Idle_Loop' }),
    )

    for (let i = 0; i < 10; i++) {
        world.resources.entities.addComponents(
            world.resources.entities.createEntity(),
            Transform3DComponent({ position: [i * 2, 10, -i * 2] }),
            RigidBodyDynamic(),
            Geometry3DComponent({ type: 'ball', radius: 0.5 }),
            // Geometry3DComponent({ type: 'box',
            //     halfWidth: 0.5,
            //     halfHeight: 0.5,
            //     halfDepth: 0.5,
            // }),
            RenderableDynamic(),
        )
    }

    const generateHeightfield = (ncols: number, nrows: number = ncols) => {
        const heights = []

        for (let i = 0; i <= ncols; i++) {
            for (let j = 0; j <= nrows; j++) {
                heights.push(Math.random())
                // heights.push(1)
                // heights.push(i / ncols)
                // heights.push(i / ncols + j / nrows)
            }
        }

        return heights
    }

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        RigidBodyFixed(),
        Transform3DComponent({
            position: [0, -1, 0],
        }),
        Geometry3DComponent({
            type: 'heightfield',
            ncols: 15,
            nrows: 10,
            heights: generateHeightfield(15, 10),
            scale: [15 * 7, 3, 10 * 7],
        }),
    )

    world.resources.three.renderer.camera.position.set(2, 4, 7)
    world.resources.three.renderer.camera.lookAt(new Vector3(0, 1, 0))

    return world
}
