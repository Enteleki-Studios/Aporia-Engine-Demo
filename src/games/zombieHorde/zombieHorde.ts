import { ECS, createEntity, HeroComponent, SpriteComponent, PositionComponent } from 'gengine'

import * as components from 'zombieHorde/components'
import * as systems from 'zombieHorde/systems'

export class ZombieHorde {
    ecs: ECS

    constructor() {
        this.ecs = new ECS()
    }

    init(canvas: HTMLCanvasElement) {
        this.ecs.registerSystem(new systems.Renderer({
            canvas,
        }))

        this.ecs.addComponent(new components.GroundComponent(createEntity()))

        const heroEntity = createEntity()
        this.ecs.addComponents([
            new HeroComponent(heroEntity),
            new PositionComponent(heroEntity, {
                position: [-5, 0, -5],
            }),
            new SpriteComponent(
                heroEntity,
                {
                    url: '/resources/zombieHorde/hero.png',
                },
            ),
        ])

        this.ecs.start()
    }
}
