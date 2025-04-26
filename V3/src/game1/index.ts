import { createDefaultEngine, pluginThree } from '@core'

import { BasicGeometryComponent, Transform3DComponent } from '@core/components'

const createEngine = () => createDefaultEngine().addPlugin(pluginThree()).build()
type Engine = Omit<ReturnType<typeof createEngine>, 'runtime'>

const moveRightSystem = (engine: Engine) => {
    const entities = engine.entities.filter(
        (components) => components.has(Transform3DComponent.__key__)
    )
    entities.forEach(([_id, components]) => {
        const transform = components.get(Transform3DComponent.__key__)
        transform.x += 1
    })
}

export const game1 = () => {
    const engine = createEngine()

    engine.runtime.addSystem((eng) => {
        console.debug({ frame: eng.clock.frame, delta: eng.clock.delta, fps: eng.clock.fps })
    })

    engine.runtime.addSystem((eng) => {
        if (eng.clock.frame === 10) {
            engine.runtime.stop()
        }
    })

    engine.runtime.addSystem(moveRightSystem)

    const transform = Transform3DComponent()
    const box = BasicGeometryComponent({
        type: 'box',
        width: 1,
        length: 1,
        height: 1,
    })
    const entity = engine.entities.createEntity()
    engine.entities.addComponents(
        entity,
        transform,
        box,
    )
    console.debug(transform)

    engine.runtime.start()
}
