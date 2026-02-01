import { glMatrix } from 'gl-matrix'

import { Ball, Box, Capsule, HeightField, Wedge } from '@core'

import {
    Geometry3DComponent,
    PlayerComponent,
    Shape3DComponent,
    Transform3DComponent,
    Velocity3DComponent,
} from '@core/components'

import {
    ColliderComponent,
    RigidBodyDynamic,
    RigidBodyFixed,
    RigidBodyKinematic,
} from '@pluginRapier3D'
import {
    Animation,
    GltfComponent,
    PerspectiveCamera,
    RenderableDynamic,
    RenderableFixed,
    createAnimatedGltfExhibit,
} from '@pluginThree'

import { createWorld } from './createWorld'
import { playerMovementSystem } from './systems/playerMovement'

export const setup = async () => {
    glMatrix.setMatrixArrayType(Array)

    const world = await createWorld()

    world.runtime.addSystem(playerMovementSystem)

    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent(),
        PerspectiveCamera({ far: 5000, yaw: Math.PI }),
    )

    // Create player
    const playerShape: Capsule = {
        type: 'capsule',
        halfHeight: 0.5,
        radius: 0.4,
    }

    world.entities.addComponents(
        world.entities.createEntity(),
        PlayerComponent(),
        Transform3DComponent({ position: [0, 11, 0] }),
        Velocity3DComponent(),
        RenderableDynamic(),
        Geometry3DComponent(playerShape),
        GltfComponent({
            path: '/humanoid/animated_robo.glb',
        }),
        Animation({ actionName: 'Idle_Loop' }),
        RigidBodyKinematic(),
        ColliderComponent(Shape3DComponent(playerShape)),
    )

    createAnimatedGltfExhibit('/humanoid/animated_robo.glb')
        .then((bundles) => {
            bundles.forEach((bundle) => {
                world.entities.addComponents(world.entities.createEntity(), ...bundle)
            })
        })
        .catch(() => {
            /**/
        })

    for (let i = 0; i < 10; i++) {
        const ballShape: Ball = { type: 'ball', radius: Math.max(i / 4, 0.1) }
        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [10, 10, 4 * i] }),
            RenderableDynamic(),
            Geometry3DComponent(ballShape),
            RigidBodyDynamic(),
            ColliderComponent(Shape3DComponent(ballShape)),
        )
    }

    const floorShape: Box = {
        type: 'box',
        halfWidth: 100,
        halfHeight: 0.25,
        halfDepth: 100,
    }

    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({ position: [0, -0.251, 0] }),
        RigidBodyFixed(),
        Geometry3DComponent(floorShape),
        RenderableFixed(),
        ColliderComponent(Shape3DComponent(floorShape)),
    )

    for (let i = 0; i < 15; i++) {
        const boxShape: Box = {
            type: 'box',
            halfWidth: 1,
            halfHeight: i / 8,
            halfDepth: 1,
        }

        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [20, i / 8, 3 * i] }),
            RigidBodyFixed(),
            Geometry3DComponent(boxShape),
            RenderableFixed(),
            ColliderComponent(Shape3DComponent(boxShape)),
        )
    }

    for (let i = 0; i < 15; i++) {
        const wedgeShape: Wedge = {
            type: 'wedge',
            halfWidth: 15,
            halfHeight: Math.max(i, 0.5),
            halfDepth: 5,
        }
        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [30, 0, 6 * i] }),
            RenderableFixed(),
            Geometry3DComponent(wedgeShape),
            RigidBodyFixed(),
            ColliderComponent(Shape3DComponent(wedgeShape)),
        )
    }

    const generateHeightfield = (ncols: number, nrows: number = ncols) => {
        const heights = []

        for (let i = 0; i <= ncols; i++) {
            for (let j = 0; j <= nrows; j++) {
                if (i === 0 || j === 0 || i === ncols || j === nrows) {
                    heights.push(0)
                } else {
                    heights.push(Math.random())
                }
                // heights.push(1)
                // heights.push((Math.random() + 0.2) * i * j * 0.01)
            }
        }

        return heights
    }

    const size = 10
    const scale = 10
    const heightfield: HeightField = {
        type: 'heightfield',
        ncols: size,
        nrows: size,
        heights: generateHeightfield(size, size),
        scale: [size * scale, 3, size * scale],
    }
    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({
            position: [-50, -0.5, 50],
        }),
        Geometry3DComponent(heightfield),
        RigidBodyFixed(),
        ColliderComponent(Shape3DComponent(heightfield)),
    )

    return world
}
