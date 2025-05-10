import { Euler, Quaternion, Vector3 } from 'three'

import { createDefaultEngine, createQuery, pluginThree } from '@core'

import {
    BasicGeometryComponent,
    GltfComponent,
    MeshComponent,
    PlayerComponent,
    Transform3DComponent,
    Velocity3DComponent,
} from '@core/components'

const createEngine = () => createDefaultEngine().addPlugin(pluginThree()).build()
type Engine = Omit<ReturnType<typeof createEngine>, 'runtime'>

const transformQuery = createQuery((entity) => entity.has(PlayerComponent))

const moveSystem = (engine: Engine) => {
    const entities = engine.entities.query(transformQuery)

    entities.forEach((entity) => {
        const transform = entity.get(Transform3DComponent)

        if (transform) {
            const dir = engine.input.left ? -1 : engine.input.right ? 1 : 0
            const scale = 9
            transform.position[0] += dir * scale * engine.clock.delta

            if (engine.input.space) {
                engine.entities.addComponents(
                    engine.entities.createEntity(),
                    ...createMissileBundle({
                        transformArgs: [structuredClone(transform)],
                        velocityArgs: [[0, 0, -5]],
                    }),
                )
            }
        }
    })
}

const velocitousQuery = createQuery((entity) => entity.has(Transform3DComponent) && entity.has(Velocity3DComponent))

const applyVelocity = (engine: Engine) => {
    const entities = engine.entities.query(velocitousQuery)

    entities.forEach((entity) => {
        const velocityComponent = entity.get(Velocity3DComponent)
        const transformComponent = entity.get(Transform3DComponent)

        if (velocityComponent && transformComponent) {
            const { velocity } = velocityComponent
            const { position } = transformComponent

            position[0] = position[0] + velocity[0] * engine.clock.delta
            position[1] = position[1] + velocity[1] * engine.clock.delta
            position[2] = position[2] + velocity[2] * engine.clock.delta
        }

    })
}

type BundleProps = {
    transformArgs?: Parameters<typeof Transform3DComponent>
    velocityArgs?: Parameters<typeof Velocity3DComponent>
}

const createAsteroidBundle = (props?: BundleProps) => {
    const args = props ?? {}

    return [
        Transform3DComponent(...(args.transformArgs ?? [])),
        Velocity3DComponent(...(args.velocityArgs ?? [])),
        GltfComponent({
            path: '/invaders/models/planet-11.gltf',
        }),
    ] as const
}

const createMissileBundle = (props?: BundleProps) => {
    const args = props ?? {}

    return [
        Transform3DComponent(...(args.transformArgs ?? [])),
        Velocity3DComponent(...(args.velocityArgs ?? [])),
        MeshComponent(),
        BasicGeometryComponent({
            type: 'sphere',
            radius: 0.3,
        }),
    ] as const
}

export const game1 = () => {
    const engine = createEngine()

    // engine.runtime.addSystem((eng) => {
    //     console.debug({
    //         // frame: eng.clock.frame,
    //         // delta: eng.clock.delta,
    //         fps: eng.clock.fps,
    //         entities: eng.entities.entities.size,
    //     })
    // })

    // engine.runtime.addSystem((eng) => {
    //     if (eng.clock.frame === 500) {
    //         engine.runtime.stop()
    //     }
    // })

    engine.runtime.addSystem(moveSystem)
    engine.runtime.addSystem(applyVelocity)

    const asteroidId = engine.entities.createEntity()
    engine.entities.addComponents(
        asteroidId,
        ...createAsteroidBundle({
            transformArgs: [
                {
                    position: [0, 0, -15],
                    scale: [0.5, 0.5, 0.5],
                },
            ],
            velocityArgs: [[0, 0, 1]],
        }),
    )

    const quat = new Quaternion()
    quat.setFromEuler(new Euler(0, Math.PI, 0))

    engine.entities.addComponents(
        engine.entities.createEntity(),
        PlayerComponent(),
        Transform3DComponent({
            // position: [-5, 0, 0],
            rotation: quat.toArray(),
            scale: [0.3, 0.3, 0.3],
        }),
        GltfComponent({
            path: '/invaders/models/ship-player.gltf',
        }),
    )

    engine.three.renderer.camera.position.set(0, 7, 7)
    engine.three.renderer.camera.lookAt(new Vector3(0, 3, 0))
    engine.runtime.start()

    return engine
}
