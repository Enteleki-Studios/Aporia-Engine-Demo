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

    addPlugin<RP extends object>(
        plugin: Plugin<RP, R>,
    ): PluginComposer<Simplify<R & RP>> {
        const result = plugin.createResources()
        const nextResources = { ...this.resources, ...result }
        const nextInitializers = [
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Not sure how to fix this yet
            ...(this.initializers as unknown as Initializer<R & RP>[]),
            ...(plugin.init ? [plugin.init] : []),
        ]

        return new PluginComposer(nextResources, nextInitializers)
    }

    build(): Runtime<R> {
        const runtime = new Runtime(this.resources)

        this.initializers.forEach((init) => {
            init(runtime)
        })

        return runtime
    }
}

export const createDefaultComposer = () => {
    return new PluginComposer({}).addPlugin(pluginEntities()).addPlugin(pluginInput())
}

export type DefaultResources = ReturnType<typeof createDefaultComposer>['resources']
