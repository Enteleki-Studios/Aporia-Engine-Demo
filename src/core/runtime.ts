import { type AnySystem, Clock, type System } from '.'

type Resources = object

export class Runtime<R extends Resources = Resources> {
    clock: Clock
    resources: R

    syncFrames = true

    private systems: AnySystem[] = []
    private loopId: number | null = null

    constructor(resources: R) {
        this.clock = new Clock()
        this.resources = resources
    }

    private loop = () => {
        this.loopId = this.syncFrames
            ? requestAnimationFrame(this.loop)
            : setTimeout(this.loop)
        this.step()
    }

    addSystem(system: System<this>) {
        this.systems.push(system)
    }

    removeSystem(system: AnySystem) {
        const index = this.systems.indexOf(system)

        if (index > -1) {
            this.systems.splice(index, 1)
        }
    }

    start() {
        this.loop()
    }

    stop() {
        if (this.loopId) {
            this.syncFrames
                ? cancelAnimationFrame(this.loopId)
                : clearTimeout(this.loopId)
            this.loopId = null
        }
    }

    step() {
        this.clock.startFrame()

        for (const system of this.systems) {
            system(this)
        }

        this.clock.endFrame()
    }

    get isRunning() {
        return Boolean(this.loopId)
    }
}
