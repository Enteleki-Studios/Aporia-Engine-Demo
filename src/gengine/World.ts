import { Clock } from 'three'

import { WORLD_MAX_DELTA } from './constants'

import { ECS } from './ECS/ECS'

export class World {
    MAX_DELTA = WORLD_MAX_DELTA

    private clock = new Clock()
    private delta = 0

    ecs = new ECS()

    getTimeElapsedS() {
        return this.delta
    }

    tick() {
        this.delta = Math.min(this.clock.getDelta(), this.MAX_DELTA)
    }
}
