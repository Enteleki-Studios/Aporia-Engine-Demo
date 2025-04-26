import { Simplify } from 'type-fest'

import { type AnySystem, type Plugin, pluginClock, pluginEntities, pluginRuntime } from '@core'

class EngineBuilder<T extends object> {
    private systems: AnySystem[] = []
    private engine: T

    constructor(engine: T, systems: AnySystem[]) {
        this.engine = engine
        this.systems = systems
    }

    addPlugin<TNew>(plugin: Plugin<T, TNew>): EngineBuilder<Simplify<T & TNew>> {
        const result = plugin.setup(this.engine)
        const nextEngine = { ...this.engine, ...result }

        if (plugin.systems) {
            this.systems.push(...plugin.systems)
        }

        return new EngineBuilder(nextEngine, this.systems)
    }

    build() {
        const next = this.addPlugin(
            pluginRuntime<T>({
                initialSystems: this.systems,
            }),
        )
        return next.engine
    }
}

export const createEngine = () => new EngineBuilder({}, [])

export const createDefaultEngine = () =>
    createEngine().addPlugin(pluginClock()).addPlugin(pluginEntities())
