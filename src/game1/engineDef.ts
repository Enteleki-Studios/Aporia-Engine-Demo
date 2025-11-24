import { Vector3 } from 'three'

import {
    Geometry3DComponent,
    PlayerComponent,
    Transform3DComponent,
} from '@core/components'

import { createQuery } from '@pluginEntities'
import { RigidBodyDynamic, RigidBodyFixed, RigidBodyKinematic } from '@pluginRapier3D'
import { Animation, GltfComponent, RenderableDynamic } from '@pluginThree'

import { type World, createWorld } from './createWorld'

const playerQuery = createQuery([PlayerComponent, Transform3DComponent, Animation])

const playerMovementSystem = (engine: World) => {
    const { input } = engine.resources
    const entities = engine.resources.entities.query(playerQuery)
    const { characterController, bodies, colliders } = engine.resources.physics

    entities.forEach(([[_, transform, animation], entity]) => {
        const dirX = input.left ? -1 : input.right ? 1 : 0
        const dirZ = input.up ? -1 : input.down ? 1 : 0

        const character = bodies.get(entity.id)
        const characterCollider = colliders.get(entity.id)

        if (character && characterCollider) {
            const speed = 2.5

            const isGrounded = characterController.computedGrounded()

            const movementDirection = {
                x: dirX * speed * engine.clock.delta,
                y: input.space
                    ? speed * engine.clock.delta
                    : isGrounded
                      ? -0.01
                      : -9.81 * engine.clock.delta,
                z: dirZ * speed * engine.clock.delta,
            }

            characterController.computeColliderMovement(
                characterCollider,
                movementDirection,
            )

            const movement = characterController.computedMovement()
            const newPos = character.translation()
            newPos.x += movement.x
            newPos.y += movement.y
            newPos.z += movement.z
            character.setNextKinematicTranslation(newPos)

            transform.position[0] = newPos.x
            transform.position[1] = newPos.y
            transform.position[2] = newPos.z

            if (dirX || dirZ) {
                animation.actionName = 'Walk_Loop'
            } else {
                animation.actionName = 'Idle_Loop'
            }
        }
    })
}

export const game1 = async () => {
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
            position: [0, -4, 0],
        }),
        Geometry3DComponent({
            type: 'heightfield',
            ncols: 15,
            nrows: 10,
            heights: generateHeightfield(15, 10),
            scale: [15 * 7, 8, 10 * 7],
        }),
    )

    world.resources.three.renderer.camera.position.set(2, 4, 7)
    world.resources.three.renderer.camera.lookAt(new Vector3(0, 1, 0))

    return world
}
