import type { System } from '@core'

// Internal system type - uses unknown for flexibility, type safety is at the API boundary
type InternalSystem = (world: unknown) => void

// Utility type that properly types the runtime with the full world type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Any is used as a check
export type TypedRuntimeWorld<W extends { runtime: Runtime<any> }> = Omit<
    W,
    'runtime'
> & {
    runtime: Runtime<W>
}

type AnyWorld = object

export class Runtime<W extends AnyWorld = AnyWorld> {
    syncFrames = true

    private world!: W // TODO: Can we remove this assertion?
    private systems: InternalSystem[] = []
    private debugSystems: InternalSystem[] = []
    private tasks: InternalSystem[] = []
    private loopId: number | null = null

    setWorld(world: W) {
        this.world = world
    }

    private loop = () => {
        this.loopId = this.syncFrames
            ? window.requestAnimationFrame(this.loop)
            : window.setTimeout(this.loop)
        this.step()
    }

    addSystem(system: System<W>) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast for internal use
        this.systems.push(system as InternalSystem)
    }

    removeSystem(system: System<W>) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast for internal use
        const index = this.systems.indexOf(system as InternalSystem)

        if (index > -1) {
            this.systems.splice(index, 1)
        }
    }

    addDebugSystem(system: System<W>) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast for internal use
        this.debugSystems.push(system as InternalSystem)
    }

    removeDebugSystem(system: System<W>) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast for internal use
        const index = this.debugSystems.indexOf(system as InternalSystem)

        if (index > -1) {
            this.debugSystems.splice(index, 1)
        }
    }

    addTask(task: InternalSystem) {
        this.tasks.push(task)
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
        for (const system of this.systems) {
            system(this.world)
        }

        for (const debugSystem of this.debugSystems) {
            debugSystem(this.world)
        }

        for (const task of this.tasks) {
            task(this.world)
        }

        this.tasks.length = 0
    }

    get isRunning() {
        return Boolean(this.loopId)
    }
}
