import { glMatrix } from 'gl-matrix'

import { Ball, Box, Capsule, HeightField, Wedge } from '@core'

import {
    Geometry3DComponent,
    PlayerComponent,
    Shape3DComponent,
    Transform3DComponent,
    Velocity3DComponent,
} from '@core/components'
import { degToRad } from '@core/utils'

import {
    ColliderComponent,
    RigidBodyDynamic,
    RigidBodyFixed,
    RigidBodyKinematic,
} from '@pluginRapier3D'
import {
    Animation,
    FloatingLabel,
    GltfComponent,
    PerspectiveCamera,
    RenderableDynamic,
    RenderableFixed,
    // createAnimatedGltfExhibit,
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
        PerspectiveCamera({ far: 5000, yaw: 0 }),
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
        Transform3DComponent({ position: [0, 11, 10] }),
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

    // createAnimatedGltfExhibit('/humanoid/animated_robo.glb')
    //     .then((bundles) => {
    //         bundles.forEach((bundle) => {
    //             world.entities.addComponents(world.entities.createEntity(), ...bundle)
    //         })
    //     })
    //     .catch(() => {
    //         /**/
    //     })

    for (let i = 0; i < 10; i++) {
        const radius = Math.max(i / 4, 0.1)
        const ballShape: Ball = { type: 'ball', radius }

        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [5 * i + 5, radius + 5, -10] }),
            RenderableDynamic(),
            Geometry3DComponent(ballShape),
            RigidBodyDynamic(),
            ColliderComponent(Shape3DComponent(ballShape)),
            FloatingLabel({
                text: `Radius: ${radius}`,
                offset: [0, radius + 0.25, 0],
            }),
        )
    }

    const floorShape: Box = {
        type: 'box',
        halfWidth: 50,
        halfHeight: 0.25,
        halfDepth: 50,
    }

    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({ position: [50, -0.251, 50] }),
        RigidBodyFixed(),
        Geometry3DComponent(floorShape),
        RenderableFixed(),
        ColliderComponent(Shape3DComponent(floorShape)),
    )

    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({ position: [50, -0.251, -50] }),
        RigidBodyFixed(),
        Geometry3DComponent(floorShape),
        RenderableFixed(),
        ColliderComponent(Shape3DComponent(floorShape)),
    )
    world.entities.addComponents(
        world.entities.createEntity(),
        Transform3DComponent({ position: [-50, -0.251, -50] }),
        RigidBodyFixed(),
        Geometry3DComponent(floorShape),
        RenderableFixed(),
        ColliderComponent(Shape3DComponent(floorShape)),
    )

    for (let i = 0; i < 26; i++) {
        const y = i / 10 || 0.05

        const boxShape: Box = {
            type: 'box',
            halfWidth: 1,
            halfHeight: y / 2,
            halfDepth: 1,
        }

        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [3 * i + 5, y / 2, 0] }),
            RigidBodyFixed(),
            Geometry3DComponent(boxShape),
            RenderableFixed(),
            ColliderComponent(Shape3DComponent(boxShape)),
            FloatingLabel({
                text: `Height: ${y}`,
                offset: [0, y / 2 + 0.25, 0],
            }),
        )
    }

    for (let i = 0; i < 29; i++) {
        const theta = i * 2.5 || 1 // In degrees
        const z = 10
        const y = z * Math.tan(degToRad(theta))

        const wedgeShape: Wedge = {
            type: 'wedge',
            halfWidth: 1,
            halfHeight: y / 2,
            halfDepth: z / 2,
        }

        world.entities.addComponents(
            world.entities.createEntity(),
            Transform3DComponent({ position: [3 * i + 5, 0, -25] }),
            RenderableFixed(),
            Geometry3DComponent(wedgeShape),
            RigidBodyFixed(),
            ColliderComponent(Shape3DComponent(wedgeShape)),
            FloatingLabel({
                text: `Angle: ${theta.toFixed(2)}°`,
                offset: [0, 2.5, z / 2],
            }),
        )
    }

    const generateHeightfield = (ncols: number, nrows: number = ncols) => {
        const heights = []

        for (let i = 0; i <= ncols; i++) {
            for (let j = 0; j <= nrows; j++) {
                if (i === 0 || j === 0 || i === ncols || j === nrows) {
                    heights.push(0.333)
                } else if (i === 1 || j === 1 || i === ncols - 1 || j === nrows - 1) {
                    heights.push(0.933)
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
            position: [-50, -1, 50],
        }),
        Geometry3DComponent(heightfield),
        RigidBodyFixed(),
        ColliderComponent(Shape3DComponent(heightfield)),
    )

    return world
}
