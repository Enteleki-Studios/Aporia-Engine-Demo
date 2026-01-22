import { type AnySystem, Clock } from '.'

export class Runtime {
    clock: Clock
    syncFrames = true

    private world!: unknown
    private systems: AnySystem[] = []
    private debugSystems: AnySystem[] = []
    private loopId: number | null = null

    constructor() {
        this.clock = new Clock()
    }

    setWorld<W>(world: W) {
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
        this.clock.startFrame()

        for (const system of this.systems) {
            system(this.world)
        }

        this.clock.endFrame()

        for (const debugSystem of this.debugSystems) {
            debugSystem(this.world)
        }
    }

    get isRunning() {
        return Boolean(this.loopId)
    }
}
