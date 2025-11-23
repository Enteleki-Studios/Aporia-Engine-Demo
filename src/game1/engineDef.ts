import { Vector3 } from 'three'

import {
    Geometry3DComponent,
    PlayerComponent,
    Transform3DComponent,
} from '@core/components'

import { createQuery } from '@pluginEntities'
import { RigidBodyDynamic, RigidBodyFixed } from '@pluginRapier3D'
import { GltfComponent, RenderableDynamic } from '@pluginThree'

import { type World, createWorld } from './createWorld'

const playerQuery = createQuery([PlayerComponent, Transform3DComponent])

const playerMovementSystem = (engine: World) => {
    const { input } = engine.resources
    const entities = engine.resources.entities.query(playerQuery)

    entities.forEach(([[_, transform]]) => {
        const dirX = input.left ? -1 : input.right ? 1 : 0
        const dirZ = input.up ? -1 : input.down ? 1 : 0

        const scale = 9

        transform.position[0] += dirX * scale * engine.clock.delta
        transform.position[2] += dirZ * scale * engine.clock.delta
    })
}

// type BundleProps = {
//     transformArgs?: Parameters<typeof Transform3DComponent>
//     velocityArgs?: Parameters<typeof Velocity3DComponent>
// }

// const createMissileBundle = (props?: BundleProps) => [
//     Transform3DComponent(...(props?.transformArgs ?? [])),
//     Velocity3DComponent(...(props?.velocityArgs ?? [])),
//     MeshComponent(),
//     BasicGeometryComponent({
//         type: 'sphere',
//         radius: 0.3,
//     }),
// ]

export const game1 = async () => {
    const world = await createWorld()

    world.addSystem(playerMovementSystem)

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        PlayerComponent(),
        Transform3DComponent({ position: [-3, 0, 0] }),
        GltfComponent({
            path: '/humanoid/animated_robo.glb',
        }),
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
            position: [0, -4, 0]
        }),
        // Geometry3DComponent({
        //     type: 'heightfield',
        //     ncols: 15,
        //     nrows: 10,
        //     heights: generateHeightfield(15, 10),
        //     scale: [15 * 7, 7, 10 * 7],
        // }),
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
