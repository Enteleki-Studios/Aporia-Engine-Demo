import { Vector3 } from 'three'

import { PlayerComponent, Transform3DComponent } from '@core/components'

import { createQuery } from '@pluginEntities'
import { GltfComponent } from '@pluginThree'

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

    world.resources.three.renderer.camera.position.set(2, 4, 7)
    world.resources.three.renderer.camera.lookAt(new Vector3(0, 1, 0))

    return world
}
