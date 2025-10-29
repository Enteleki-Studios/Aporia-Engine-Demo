import type { AnySystem, System } from '.'

type Resources = object

export class Runtime<R extends Resources = Resources> {
    resources: R

    private systems: AnySystem[] = []
    private animationRequestId: number | null = null

    constructor(resources: R) {
        this.resources = resources
    }

    private loop = () => {
        this.animationRequestId = requestAnimationFrame(this.loop)
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
        if (this.animationRequestId) {
            cancelAnimationFrame(this.animationRequestId)
        }
        this.animationRequestId = null
    }

    step() {
        for (const system of this.systems) {
            system(this)
        }
    }

    get isRunning() {
        return Boolean(this.animationRequestId)
    }
}
