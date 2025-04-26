import type { AnySystem, Plugin, System } from '.'

class Runtime<W> {
    private systems: AnySystem[]
    private engine: object

    private animationRequestId = 0

    constructor(engine: object, systems: AnySystem[]) {
        this.engine = engine
        this.systems = systems
    }

    private tick = () => {
        this.animationRequestId = requestAnimationFrame(this.tick)
        this.step()
    }

    addSystem(system: System<W>) {
        this.systems.push(system)
    }

    start() {
        this.tick()
    }

    stop() {
        cancelAnimationFrame(this.animationRequestId)
    }

    step() {
        for (const system of this.systems) {
            system(this.engine)
        }
    }
}

type Props = {
    initialSystems: AnySystem[]
}

export type RuntimeOutput<W> = {
    runtime: Runtime<W>
}

export const pluginRuntime = <W>({ initialSystems }: Props): Plugin<object, RuntimeOutput<W>> => ({
    setup: (engine) => ({
        runtime: new Runtime(engine, initialSystems),
    }),
})
