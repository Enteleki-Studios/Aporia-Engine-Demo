import type { World as PhysicsWorld } from '@dimforge/rapier3d'

import { type World, type Plugin } from '@gengine/core'

export class Rapier3DPlugin implements Plugin {
    name = 'Rapier 3D Physics Plugin'

    physicsWorld?: PhysicsWorld

    async init(world: World) {
        const rapier = await import('@dimforge/rapier3d')
        console.debug(rapier)
    }
}
