import * as cannon from 'cannon-es'

import { Entity, EntityId, collider3D, Plugin, rigidBody3D, World } from '@gengine/core'
import { transform3D, velocityComponent, Shape, characterBody3D } from '@gengine/core'

import { physicsSystem } from 'systems'

export { physicsBody } from 'components'

const extControlMaterial = new cannon.Material()

export const physicsBodyQuery = {
    match(entity: Entity) {
        return entity.has(transform3D) && entity.hasSome([rigidBody3D, characterBody3D])
    }
}
export const physicsExtVelocityFilter = {
    match(entity: Entity) {
        return physicsBodyQuery.match(entity) && entity.has(velocityComponent)
    }
}
export class CannonPhysicsPlugin implements Plugin {
    name = 'Cannon Physics 3D Plugin'

    private receiver: ReturnType<typeof physicsBodyReceiver>

    physicsWorld: cannon.World
    physicsBodyByEntityId: Map<EntityId, cannon.Body>

    constructor() {
        this.physicsBodyByEntityId = new Map()

        this.physicsWorld = new cannon.World({
            gravity: new cannon.Vec3(0, -9.8, 0),
        })

        this.receiver = physicsBodyReceiver(this.physicsWorld, this.physicsBodyByEntityId)


        this.physicsWorld.addContactMaterial(
            new cannon.ContactMaterial(this.physicsWorld.defaultMaterial, extControlMaterial, {
                friction: 0,
                restitution: 0.2,
            }),
        )
        this.physicsWorld.addContactMaterial(
            new cannon.ContactMaterial(extControlMaterial, extControlMaterial, {
                friction: 0,
                restitution: 0.2,
            }),
        )
    }

    init(world: World) {
        world.registerSystem(physicsSystem())

        world.ecs.addFilterListener(physicsBodyQuery, this.receiver)
    }
}

const physicsBodyReceiver =
    (physicsWorld: cannon.World, physicsBodyByEntityId: Map<EntityId, cannon.Body>) => (entity: Entity) => {
        const isCharacter = entity.has(characterBody3D)

        const bodySettings = entity.get(isCharacter ? characterBody3D : rigidBody3D)
        const colliderSettings = entity.get(collider3D)

        const body = new cannon.Body({
            mass: bodySettings.mass,
            fixedRotation: bodySettings.fixedRotation ?? isCharacter,
            shape: makePhysicsShape(colliderSettings.shape),
            // material: settings.material
            //     ? new cannon.Material(settings.material)
            //     : isCharacter
            //       ? extControlMaterial
            //       : physicsWorld.defaultMaterial,
            material: isCharacter ? extControlMaterial : physicsWorld.defaultMaterial
        })

        const { position, rotation } = entity.get(transform3D)

        body.position.set(...position)
        body.quaternion.setFromEuler(...rotation)

        if (bodySettings.velocity) {
            body.velocity.set(...bodySettings.velocity)
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
        case 'cylinder': {
            const { radius, height } = shape
            return new cannon.Cylinder(radius, radius, height)
        }
        default:
            return new cannon.Shape()
    }
}
