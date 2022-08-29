import { Clock } from 'three'

import { WORLD_MAX_DELTA, WorldEvent } from './constants'

import { ECS } from './ECS/ECS'

export class World {
    MAX_DELTA = WORLD_MAX_DELTA

    private clock = new Clock()
    private delta = 0
    private observers: Record<WorldEvent, Array<() => void>> = {
        endframe: [],
    }

    ecs = new ECS()
    isRunning = false

    constructor() {
        this.addEventListener.bind(this)
    }

    get timeElapsedS() {
        return this.delta
    }

    private tick() {
        this.delta = Math.min(this.clock.getDelta(), this.MAX_DELTA)

        this.ecs.tick(this)

        this.observers.endframe.forEach((c) => c())

        if (this.isRunning) {
            requestAnimationFrame(this.tick.bind(this))
        }
    }

    start() {
        this.isRunning = true
        this.tick()
    }

    stop() {
        this.isRunning = false
    }

    getStats() {
        return 'temp'
    }

    addEventListener(eventName: WorldEvent, callback: () => void) {
        this.observers[eventName].push(callback)
    }
}
