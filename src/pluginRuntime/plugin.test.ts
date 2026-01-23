import { describe, test } from 'vitest'

import { type Plugin, PluginComposer, type PluginsToResources, type System } from '@core'

import { type PluginRuntime, pluginRuntime } from './plugin'

type RuntimeDependencies = PluginsToResources<[PluginRuntime]>

type PlayerProvides = {
    player: { x: number; y: number }
}

const pluginPlayer = (): Plugin<PlayerProvides, RuntimeDependencies> => ({
    createResources() {
        return {
            player: { x: 0, y: 0 },
        }
    },
    init(world) {
        world.runtime.addSystem((w) => {
            w.player.x += 1
        })
    },
})

type PluginPlayer = ReturnType<typeof pluginPlayer>

type EnemyProvides = {
    enemies: { id: string; health: number }[]
}

const pluginEnemy = (): Plugin<EnemyProvides, RuntimeDependencies> => ({
    createResources() {
        return {
            enemies: [],
        }
    },
    init(world) {
        world.runtime.addSystem((w) => {
            for (const enemy of w.enemies) {
                enemy.health -= 1
            }
        })
    },
})

type PluginEnemy = ReturnType<typeof pluginEnemy>

describe('pluginRuntime type safety', () => {
    test('plugin can add system that uses its own resources', async () => {
        const world = await new PluginComposer([])
            .addPlugin(pluginRuntime())
            .addPlugin(pluginPlayer())
            .build()

        world.runtime.step()
    })

    test('plugin cannot add system requiring resources from other plugins', () => {
        type FullWorld = PluginsToResources<[PluginRuntime, PluginPlayer, PluginEnemy]>

        const systemNeedingEnemies: System<FullWorld> = (w) => {
            w.enemies.push({ id: 'e1', health: 100 })
        }

        const brokenPlugin = (): Plugin<PlayerProvides, RuntimeDependencies> => ({
            createResources() {
                return {
                    player: { x: 0, y: 0 },
                }
            },
            init(world) {
                // This plugin only has access to runtime + player
                // It should not be able to add a system that requires enemies
                // @ts-expect-error - System requires enemies but world only has runtime + player
                world.runtime.addSystem(systemNeedingEnemies)
            },
        })

        // Plugin is valid to create, but the type error is inside init
        brokenPlugin()
    })

    test('composed world allows systems that use all available resources', async () => {
        type FullWorld = PluginsToResources<[PluginRuntime, PluginPlayer, PluginEnemy]> &
            PlayerProvides &
            EnemyProvides

        const systemUsingBoth: System<FullWorld> = (w) => {
            if (w.enemies.length > 0) {
                w.player.x += 10
            }
        }

        const pluginUsingBoth = (): Plugin<object, FullWorld> => ({
            init(world) {
                // This plugin declares it requires both player and enemies
                // So it can add systems that use both
                world.runtime.addSystem(systemUsingBoth)
            },
        })

        await new PluginComposer([])
            .addPlugin(pluginRuntime())
            .addPlugin(pluginPlayer())
            .addPlugin(pluginEnemy())
            .addPlugin(pluginUsingBoth())
            .build()
    })
})
