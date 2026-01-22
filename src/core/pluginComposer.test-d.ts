import { assertType, expectTypeOf, test } from 'vitest'

import { type Plugin } from '@core'

import { PluginComposer } from './pluginComposer'

/* TODO
 * Pass depended-upon resources to createResources()
 */

const plugA: Plugin<{ resA: string }> = {
    createResources() {
        return {
            resA: 'test A',
        }
    },
}

const plugB: Plugin<{ resB: string }> = {
    createResources() {
        return {
            resB: 'test B',
        }
    },
}

const plugC: Plugin<{ resC: string }, { resB: string }> = {
    createResources() {
        return {
            resC: 'test C',
        }
    },
}

test('can build with one plugin', async () => {
    const world = await new PluginComposer([]).addPlugin(plugA).build()

    expectTypeOf(world.resA).toEqualTypeOf<string>()
})

test('can build with two plugins', async () => {
    const world = await new PluginComposer([]).addPlugin(plugA).addPlugin(plugB).build()

    expectTypeOf(world.resA).toEqualTypeOf<string>()
    expectTypeOf(world.resB).toEqualTypeOf<string>()
})

test('can add plugins with dependencies', async () => {
    assertType(await new PluginComposer([]).addPlugin(plugB).addPlugin(plugC).build())
})

test('type error when dependencies are unmet', async () => {
    // @ts-expect-error plugC depends on resB
    assertType(await new PluginComposer([]).addPlugin(plugC).build())
})

test('can add plugin with no resources', async () => {
    const plugInitOnly: Plugin<object> = {
        init(w) {
            console.log(w)
        },
    }

    assertType(await new PluginComposer([]).addPlugin(plugInitOnly).build())
})

test('can add plugin with dependencies and no resources', async () => {
    const plugInitOnly: Plugin<object, { resB: string }> = {
        init(w) {
            console.log(w.resB)
        },
    }

    // @ts-expect-error Missing dependency
    assertType(await new PluginComposer([]).addPlugin(plugInitOnly).build())
    assertType(
        await new PluginComposer([]).addPlugin(plugB).addPlugin(plugInitOnly).build(),
    )
})
