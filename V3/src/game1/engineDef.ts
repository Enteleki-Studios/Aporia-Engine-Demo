import { Euler, Quaternion, Vector3 } from 'three'

import { createDefaultEngine, createQuery, pluginThree } from '@core'

import {
    BasicGeometryComponent,
    GltfComponent,
    MeshComponent,
    Transform3DComponent,
} from '@core/components'

const createEngine = () => createDefaultEngine().addPlugin(pluginThree()).build()
type Engine = Omit<ReturnType<typeof createEngine>, 'runtime'>

const transformQuery = createQuery((entity) => entity.has(Transform3DComponent))

const moveSystem = (engine: Engine) => {
    const entities = engine.entities.query(transformQuery)

    entities.forEach((entity) => {
        const transform = entity.get(Transform3DComponent)

        if (transform) {
            const dir = engine.input.left ? -1 : engine.input.right ? 1 : 0
            const scale = 3
            transform.position[0] += dir * scale * engine.clock.delta
        }
    })
}

export const game1 = () => {
    const engine = createEngine()

    // engine.runtime.addSystem((eng) => {
    //     console.debug({
    //         frame: eng.clock.frame,
    //         delta: eng.clock.delta,
    //         fps: eng.clock.fps,
    //     })
    // })

    // engine.runtime.addSystem((eng) => {
    //     if (eng.clock.frame === 500) {
    //         engine.runtime.stop()
    //     }
    // })

    engine.runtime.addSystem(moveSystem)

    const transform = Transform3DComponent({
        position: [-5, 0, -10],
    })
    const box = BasicGeometryComponent({
        type: 'box',
        width: 1,
        length: 1,
        height: 1,
    })
    const entity = engine.entities.createEntity()
    engine.entities.addComponents(entity, transform, MeshComponent(), box)

    const quat = new Quaternion()
    quat.setFromEuler(new Euler(0, Math.PI, 0))

    engine.entities.addComponents(
        engine.entities.createEntity(),
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
