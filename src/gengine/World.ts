import { Clock } from 'three'

import { WORLD_MAX_DELTA, WorldEvent } from './constants'

import { ECS } from './ECS/ECS'

export interface StatsType {
    fps: number
    frameLength: number
}

export class World {
    MAX_DELTA = WORLD_MAX_DELTA

    private clock = new Clock()
    private delta = 0
    private observers: Record<WorldEvent, Array<() => void>> = {
        endframe: [],
    }

    stats: StatsType = {
        fps: 0,
        frameLength: 0,
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
        performance.mark('framestart')
        this.delta = Math.min(this.clock.getDelta(), this.MAX_DELTA)
        this.stats.fps = Math.floor(1 / this.delta)

        this.ecs.tick(this)

        this.stats.frameLength = performance.measure('frame length', 'framestart').duration
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

    addEventListener(eventName: WorldEvent, callback: () => void) {
        this.observers[eventName].push(callback)
    }
}
