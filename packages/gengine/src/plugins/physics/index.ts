import * as cannon from 'cannon-es'

import { ECSFilter, Entity, EntityId, createPlugin } from 'core'

import { physicsSystem } from './systems'
import { Shape, physicsBody } from './components'
import { transform3D, velocityComponent } from 'components'

export const physicsFilter = ECSFilter.of([transform3D, physicsBody])
export const physicsExtVelocityFilter = ECSFilter.of([transform3D, velocityComponent, physicsBody])

export const physicsPlugin = createPlugin('Physics 3D plugin (Cannon)', () => {
    const physicsWorld = new cannon.World({
        gravity: new cannon.Vec3(0, -9.8, 0),
    })
    const physicsBodyByEntityId = new Map<EntityId, cannon.Body>()

    const receiver = physicsBodyReceiver(physicsWorld, physicsBodyByEntityId)

    return {
        init(world) {
            world.registerSystem(physicsSystem())

            world.ecs.registerFilter(physicsFilter)
            world.ecs.registerFilter(physicsExtVelocityFilter)

            world.ecs.addFilterListener(physicsFilter, receiver)
        },
        resources: {
            physicsWorld,
            physicsBodyByEntityId,
        },
    }
})

export const physicsComponents = {
    physicsBody,
}

const physicsBodyReceiver = (physicsWorld: cannon.World, physicsBodyByEntityId: Map<EntityId, cannon.Body>) => (entity: Entity) => {
    const settings = entity.get(physicsBody)

    const body = new cannon.Body({
        mass: settings.mass,
        fixedRotation: settings.fixedRotation,
        shape: makePhysicsShape(settings.shape),
        material: settings.material ? new cannon.Material(settings.material) : undefined
    })

    const { position, rotation } = entity.get(transform3D)

    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation)

    if (settings.velocity) {
        body.velocity.set(...settings.velocity)
    }


    physicsWorld.addBody(body)
    physicsBodyByEntityId.set(entity.id, body)
}

const makePhysicsShape = (shape: Shape): cannon.Shape => {
    switch (shape.type) {
        case 'box':
            return new cannon.Box(new cannon.Vec3(...shape.size))
        case 'plane':
            return new cannon.Plane()
        case 'sphere':
            return new cannon.Sphere(shape.radius)
        default:
            return new cannon.Shape()
    }
}
