import { Simplify } from 'type-fest'

import { type Plugin, Runtime } from '@core'

import { pluginEntities } from '@pluginEntities'
import { pluginInput } from '@pluginInput'

type Initializer<R extends object> = (engine: Runtime<R>) => void

class PluginComposer<R extends object> {
    private resources: R
    private initializers: Initializer<R>[] = []

    constructor(resources: R, initializers?: Initializer<R>[]) {
        this.resources = resources
        this.initializers = initializers ?? []
    }

    // RP: Resources Provided
    // R: Resources Required
    addPlugin<RP>(plugin: Plugin<RP, R>): PluginComposer<Simplify<RP & R>> {
        const result = plugin.createResources()
        const nextResources = { ...this.resources, ...result }
        const nextInitializers = [
            ...this.initializers,
            ...(plugin.init ? [plugin.init] : []),
        ]

        return new PluginComposer(nextResources, nextInitializers)
    }

    build() {
        const runtime = new Runtime(this.resources)

        this.initializers.forEach((init) => {
            init(runtime)
        })

        return runtime
    }
}

export const createDefaultComposer = () =>
    new PluginComposer({}).addPlugin(pluginEntities()).addPlugin(pluginInput())

export type DefaultResources = ReturnType<typeof createDefaultComposer>['resources']
