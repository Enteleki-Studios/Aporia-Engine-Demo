import type { AnySystem, System } from '.'

type Resources = object

export class Runtime<R extends Resources = Resources> {
    resources: R

    private systems: AnySystem[] = []
    private animationRequestId = 0

    constructor(engine: R) {
        this.resources = engine
    }

    private tick = () => {
        this.animationRequestId = requestAnimationFrame(this.tick)
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
        this.tick()
    }

    stop() {
        cancelAnimationFrame(this.animationRequestId)
    }

    step() {
        for (const system of this.systems) {
            system(this)
        }
    }
}
