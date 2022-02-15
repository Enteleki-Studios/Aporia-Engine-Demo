import { ECS, BasicRenderer } from 'gengine'

export class ZombieHorde {
    ecs: ECS

    constructor() {
        this.ecs = new ECS()
    }

    init(canvas: HTMLCanvasElement) {
        this.ecs.registerSystem(new BasicRenderer({
            canvas,
        }))
        this.ecs.start()
    }
}
