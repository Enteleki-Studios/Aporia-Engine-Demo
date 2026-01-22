import type { AnySystem, Clock } from '@core'

type WorldWithClock = { clock: Clock }

export class Runtime {
    syncFrames = true

    private world!: WorldWithClock
    private systems: AnySystem[] = []
    private debugSystems: AnySystem[] = []
    private loopId: number | null = null

    setWorld(world: WorldWithClock) {
        this.world = world
    }

    private loop = () => {
        this.loopId = this.syncFrames
            ? window.requestAnimationFrame(this.loop)
            : window.setTimeout(this.loop)
        this.step()
    }

    addSystem(system: AnySystem) {
        this.systems.push(system)
    }

    removeSystem(system: AnySystem) {
        const index = this.systems.indexOf(system)

        if (index > -1) {
            this.systems.splice(index, 1)
        }
    }

    addDebugSystem(system: AnySystem) {
        this.debugSystems.push(system)
    }

    removeDebugSystem(system: AnySystem) {
        const index = this.debugSystems.indexOf(system)

        if (index > -1) {
            this.debugSystems.splice(index, 1)
        }
    }

    start() {
        this.loop()
    }

    stop() {
        if (this.loopId) {
            if (this.syncFrames) {
                window.cancelAnimationFrame(this.loopId)
            } else {
                window.clearTimeout(this.loopId)
            }
            this.loopId = null
        }
    }

    step() {
        this.world.clock.startFrame()

        for (const system of this.systems) {
            system(this.world)
        }

        this.world.clock.endFrame()

        for (const debugSystem of this.debugSystems) {
            debugSystem(this.world)
        }
    }

    get isRunning() {
        return Boolean(this.loopId)
    }
}
