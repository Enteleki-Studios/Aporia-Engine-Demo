import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import type { System } from '@core'

import { Runtime } from './runtime'

type MockWorld = {
    value: number
}

const createMockWorld = (): MockWorld => ({
    value: 0,
})

describe('Runtime', () => {
    let runtime: Runtime<MockWorld>
    let world: MockWorld
    let mockRequestAnimationFrame: ReturnType<typeof vi.fn>
    let mockCancelAnimationFrame: ReturnType<typeof vi.fn>
    let mockSetTimeout: ReturnType<typeof vi.fn>
    let mockClearTimeout: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockRequestAnimationFrame = vi.fn(() => 1)
        mockCancelAnimationFrame = vi.fn()
        mockSetTimeout = vi.fn(() => 2)
        mockClearTimeout = vi.fn()

        vi.stubGlobal('window', {
            requestAnimationFrame: mockRequestAnimationFrame,
            cancelAnimationFrame: mockCancelAnimationFrame,
            setTimeout: mockSetTimeout,
            clearTimeout: mockClearTimeout,
        })

        runtime = new Runtime<MockWorld>()
        world = createMockWorld()
        runtime.setWorld(world)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('addSystem / removeSystem', () => {
        test('adds a system that gets called on step', () => {
            const system = vi.fn()
            runtime.addSystem(system)

            runtime.step()

            expect(system).toHaveBeenCalledTimes(1)
            expect(system).toHaveBeenCalledWith(world)
        })

        test('calls multiple systems in order', () => {
            const callOrder: number[] = []
            const system1 = vi.fn(() => callOrder.push(1))
            const system2 = vi.fn(() => callOrder.push(2))
            const system3 = vi.fn(() => callOrder.push(3))

            runtime.addSystem(system1)
            runtime.addSystem(system2)
            runtime.addSystem(system3)

            runtime.step()

            expect(callOrder).toEqual([1, 2, 3])
        })

        test('removes a system so it no longer gets called', () => {
            const system = vi.fn()
            runtime.addSystem(system)
            runtime.removeSystem(system)

            runtime.step()

            expect(system).not.toHaveBeenCalled()
        })

        test('removeSystem does nothing if system was never added', () => {
            const system = vi.fn()

            expect(() => {
                runtime.removeSystem(system)
            }).not.toThrow()
        })
    })

    describe('addDebugSystem / removeDebugSystem', () => {
        test('adds a debug system that gets called on step after regular systems', () => {
            const callOrder: string[] = []
            const system = vi.fn(() => callOrder.push('system'))
            const debugSystem = vi.fn(() => callOrder.push('debug'))

            runtime.addSystem(system)
            runtime.addDebugSystem(debugSystem)

            runtime.step()

            expect(callOrder).toEqual(['system', 'debug'])
        })

        test('removes a debug system so it no longer gets called', () => {
            const debugSystem = vi.fn()
            runtime.addDebugSystem(debugSystem)
            runtime.removeDebugSystem(debugSystem)

            runtime.step()

            expect(debugSystem).not.toHaveBeenCalled()
        })

        test('removeDebugSystem does nothing if system was never added', () => {
            const debugSystem = vi.fn()

            expect(() => {
                runtime.removeDebugSystem(debugSystem)
            }).not.toThrow()
        })
    })

    describe('step', () => {
        test('runs all systems then all debug systems', () => {
            const callOrder: string[] = []
            const system1 = vi.fn(() => callOrder.push('system1'))
            const system2 = vi.fn(() => callOrder.push('system2'))
            const debug1 = vi.fn(() => callOrder.push('debug1'))
            const debug2 = vi.fn(() => callOrder.push('debug2'))

            runtime.addSystem(system1)
            runtime.addSystem(system2)
            runtime.addDebugSystem(debug1)
            runtime.addDebugSystem(debug2)

            runtime.step()

            expect(callOrder).toEqual(['system1', 'system2', 'debug1', 'debug2'])
        })
    })

    describe('start / stop', () => {
        test('start begins the loop using requestAnimationFrame when syncFrames is true', () => {
            runtime.syncFrames = true
            runtime.start()

            expect(mockRequestAnimationFrame).toHaveBeenCalled()
            expect(runtime.isRunning).toBe(true)

            runtime.stop()
        })

        test('start begins the loop using setTimeout when syncFrames is false', () => {
            runtime.syncFrames = false
            runtime.start()

            expect(mockSetTimeout).toHaveBeenCalled()
            expect(runtime.isRunning).toBe(true)

            runtime.stop()
        })

        test('stop cancels requestAnimationFrame when syncFrames is true', () => {
            runtime.syncFrames = true
            runtime.start()
            runtime.stop()

            expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1)
            expect(runtime.isRunning).toBe(false)
        })

        test('stop clears timeout when syncFrames is false', () => {
            runtime.syncFrames = false
            runtime.start()
            runtime.stop()

            expect(mockClearTimeout).toHaveBeenCalledWith(2)
            expect(runtime.isRunning).toBe(false)
        })

        test('stop does nothing if not running', () => {
            runtime.stop()

            expect(mockCancelAnimationFrame).not.toHaveBeenCalled()
            expect(mockClearTimeout).not.toHaveBeenCalled()
        })
    })

    describe('isRunning', () => {
        test('returns false initially', () => {
            expect(runtime.isRunning).toBe(false)
        })

        test('returns true after start', () => {
            runtime.start()

            expect(runtime.isRunning).toBe(true)

            runtime.stop()
        })

        test('returns false after stop', () => {
            runtime.start()
            runtime.stop()

            expect(runtime.isRunning).toBe(false)
        })
    })

    describe('syncFrames', () => {
        test('defaults to true', () => {
            expect(runtime.syncFrames).toBe(true)
        })

        test('can be set to false', () => {
            runtime.syncFrames = false

            expect(runtime.syncFrames).toBe(false)
        })
    })

    describe('typed standalone systems', () => {
        type GameWorld = {
            player: { x: number; y: number }
            enemies: { id: string; health: number }[]
        }

        const createGameWorld = (): GameWorld => ({
            player: { x: 0, y: 0 },
            enemies: [],
        })

        test('standalone system with typed world argument is accepted by typed runtime', () => {
            const gameRuntime = new Runtime<GameWorld>()
            const gameWorld = createGameWorld()
            gameRuntime.setWorld(gameWorld)

            const movePlayerSystem: System<GameWorld> = (w) => {
                w.player.x += 1
                w.player.y += 1
            }

            gameRuntime.addSystem(movePlayerSystem)
            gameRuntime.step()

            expect(gameWorld.player.x).toBe(1)
            expect(gameWorld.player.y).toBe(1)
        })

        test('standalone system can access world-specific resources', () => {
            const gameRuntime = new Runtime<GameWorld>()
            const gameWorld = createGameWorld()
            gameWorld.enemies = [
                { id: 'e1', health: 100 },
                { id: 'e2', health: 50 },
            ]
            gameRuntime.setWorld(gameWorld)

            const damageAllEnemiesSystem: System<GameWorld> = (w) => {
                for (const enemy of w.enemies) {
                    enemy.health -= 10
                }
            }

            gameRuntime.addSystem(damageAllEnemiesSystem)
            gameRuntime.step()

            expect(gameWorld.enemies[0]?.health).toBe(90)
            expect(gameWorld.enemies[1]?.health).toBe(40)
        })

        test('multiple standalone systems work together', () => {
            const gameRuntime = new Runtime<GameWorld>()
            const gameWorld = createGameWorld()
            gameWorld.enemies = [{ id: 'e1', health: 100 }]
            gameRuntime.setWorld(gameWorld)

            const spawnEnemySystem: System<GameWorld> = (w) => {
                w.enemies.push({ id: 'e2', health: 50 })
            }

            const countEnemiesSystem: System<GameWorld> = (w) => {
                w.player.x = w.enemies.length
            }

            gameRuntime.addSystem(spawnEnemySystem)
            gameRuntime.addSystem(countEnemiesSystem)
            gameRuntime.step()

            expect(gameWorld.enemies).toHaveLength(2)
            expect(gameWorld.player.x).toBe(2)
        })

        test('TypedRuntimeWorld enables type-safe world.runtime.addSystem()', () => {
            type ComposedWorld = {
                runtime: Runtime<ComposedWorld>
                player: { x: number; y: number }
            }

            const composedWorld: ComposedWorld = {
                runtime: new Runtime<ComposedWorld>(),
                player: { x: 0, y: 0 },
            }
            composedWorld.runtime.setWorld(composedWorld)

            const moveSystem: System<ComposedWorld> = (w) => {
                w.player.x += 10
            }

            composedWorld.runtime.addSystem(moveSystem)
            composedWorld.runtime.step()

            expect(composedWorld.player.x).toBe(10)
        })
    })

    describe('type safety', () => {
        test('rejects systems that require resources not in the world type', () => {
            type MinimalWorld = {
                player: { x: number }
            }

            type ExtendedWorld = MinimalWorld & {
                enemies: { id: string }[]
            }

            const minimalRuntime = new Runtime<MinimalWorld>()
            minimalRuntime.setWorld({ player: { x: 0 } })

            const systemNeedingEnemies: System<ExtendedWorld> = (w) => {
                w.enemies.push({ id: 'e1' })
            }

            // @ts-expect-error - System requires enemies but runtime only has player
            minimalRuntime.addSystem(systemNeedingEnemies)
        })
    })
})
