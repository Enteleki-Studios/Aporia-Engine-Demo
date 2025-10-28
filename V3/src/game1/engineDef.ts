import { Euler, Quaternion, Vector3 } from 'three'

import { createDefaultComposer, createQuery, pluginThree } from '@core'

import {
    BasicGeometryComponent,
    GltfComponent,
    MeshComponent,
    PlayerComponent,
    Transform3DComponent,
    Velocity3DComponent,
} from '@core/components'

const createEngine = () => createDefaultComposer().addPlugin(pluginThree()).build()
type Engine = ReturnType<typeof createEngine>

const transformQuery = createQuery((entity) => entity.has(PlayerComponent))

const moveSystem = (engine: Engine) => {
    const { input } = engine.resources
    const entities = engine.resources.entities.query(transformQuery)

    entities.forEach((entity) => {
        const transform = entity.get(Transform3DComponent)

        if (transform) {
            const dir = input.left ? -1 : input.right ? 1 : 0
            const scale = 9
            transform.position[0] += dir * scale * engine.resources.clock.delta

            if (input.space) {
                engine.resources.entities.addComponents(
                    engine.resources.entities.createEntity(),
                    ...createMissileBundle({
                        transformArgs: [structuredClone(transform)],
                        velocityArgs: [[0, 0, -5]],
                    }),
                )
            }
        }
    })
}

const velocitousQuery = createQuery(
    (entity) => entity.has(Transform3DComponent) && entity.has(Velocity3DComponent),
)

const applyVelocitySystem = (engine: Engine) => {
    const entities = engine.resources.entities.query(velocitousQuery)

    entities.forEach((entity) => {
        const velocityComponent = entity.get(Velocity3DComponent)
        const transformComponent = entity.get(Transform3DComponent)

        if (velocityComponent && transformComponent) {
            const { velocity } = velocityComponent
            const { position } = transformComponent

            position[0] = position[0] + velocity[0] * engine.resources.clock.delta
            position[1] = position[1] + velocity[1] * engine.resources.clock.delta
            position[2] = position[2] + velocity[2] * engine.resources.clock.delta
        }
    })
}

type BundleProps = {
    transformArgs?: Parameters<typeof Transform3DComponent>
    velocityArgs?: Parameters<typeof Velocity3DComponent>
}

const createAsteroidBundle = (props?: BundleProps) => [
    Transform3DComponent(...(props?.transformArgs ?? [])),
    Velocity3DComponent(...(props?.velocityArgs ?? [])),
    GltfComponent({
        path: '/invaders/models/planet-11.gltf',
    }),
]

const createMissileBundle = (props?: BundleProps) => [
    Transform3DComponent(...(props?.transformArgs ?? [])),
    Velocity3DComponent(...(props?.velocityArgs ?? [])),
    MeshComponent(),
    BasicGeometryComponent({
        type: 'sphere',
        radius: 0.3,
    }),
]

export const game1 = () => {
    const engine = createEngine()

    // engine.addSystem((world) => {
    //     console.debug({
    //         // frame: eng.clock.frame,
    //         // delta: eng.clock.delta,
    //         fps: world.resources.clock.fps,
    //         entities: world.resources.entities.entities.size,
    //     })
    // })

    // engine.runtime.addSystem((eng) => {
    //     if (eng.clock.frame === 500) {
    //         engine.runtime.stop()
    //     }
    // })

    engine.addSystem(moveSystem)
    engine.addSystem(applyVelocitySystem)

    const asteroidId = engine.resources.entities.createEntity()
    engine.resources.entities.addComponents(
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

    engine.resources.entities.addComponents(
        engine.resources.entities.createEntity(),
        PlayerComponent(),
        Transform3DComponent({
            rotation: quat.toArray(),
            scale: [0.3, 0.3, 0.3],
        }),
        GltfComponent({
            path: '/invaders/models/ship-player.gltf',
        }),
    )

    engine.resources.three.renderer.camera.position.set(0, 7, 7)
    engine.resources.three.renderer.camera.lookAt(new Vector3(0, 3, 0))

    return engine
}
