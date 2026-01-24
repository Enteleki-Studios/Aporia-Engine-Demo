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
        Transform3DComponent({ position: [0, 10, 0] }),
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

    const ballShape: Ball = { type: 'ball', radius: 0.5 }
    for (let i = 0; i < 10; i++) {
        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [i * 2, 10, -i * 2] }),
            RenderableDynamic(),
            Geometry3DComponent(ballShape),
            RigidBodyDynamic(),
            ColliderComponent(Shape3DComponent(ballShape)),
        )
    }

    const boxShape: Box = {
        type: 'box',
        halfWidth: 10,
        halfHeight: 10,
        halfDepth: 10,
    }

    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({ position: [-15, 10, 25] }),
        RigidBodyFixed(),
        Geometry3DComponent(boxShape),
        RenderableFixed(),
        ColliderComponent(Shape3DComponent(boxShape)),
    )

    const wedgeShape: Wedge = {
        type: 'wedge',
        halfWidth: 15,
        halfHeight: 5,
        halfDepth: 5,
    }
    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({ position: [0, 1, 4] }),
        RenderableDynamic(),
        Geometry3DComponent(wedgeShape),
        RigidBodyDynamic(),
        ColliderComponent(Shape3DComponent(wedgeShape)),
    )

    const generateHeightfield = (ncols: number, nrows: number = ncols) => {
        const heights = []

        for (let i = 0; i <= ncols; i++) {
            for (let j = 0; j <= nrows; j++) {
                heights.push(Math.random())
                // heights.push(1)
                // heights.push((Math.random() + 0.2) * i * j * 0.01)
            }
        }

        return heights
    }

    const size = 40
    const scale = 20
    const heightfield: HeightField = {
        type: 'heightfield',
        ncols: size,
        nrows: size,
        heights: generateHeightfield(size, size),
        scale: [size * scale, 5, size * scale],
    }
    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({
            position: [0, -1.5, 0],
        }),
        Geometry3DComponent(heightfield),
        RigidBodyFixed(),
        ColliderComponent(Shape3DComponent(heightfield)),
    )

    return world
}
