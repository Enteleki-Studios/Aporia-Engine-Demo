import type { ColliderDesc, KinematicCharacterController, World as PhysicsWorld, RigidBody } from '@dimforge/rapier3d'

import {
    type World,
    type Plugin,
    type Entity,
    createSystem,
    EntityId,
    log,
    transform3D,
    rigidBody3D,
    characterBody3D,
    Shape3D,
    collider3D,
} from '@gengine/core'

import { type Rapier, getRapier } from 'rapier'

type PhysicsBodies = Map<EntityId, RigidBody>

const GRAVITY_3D = { x: 0, y: -9.81, z: 0 }

export const physicsBodyQuery = {
    match(entity: Entity) {
        return entity.has(transform3D) && entity.has(collider3D) && entity.hasSome([rigidBody3D, characterBody3D])
    },
}

export class Rapier3DPlugin implements Plugin {
    name = 'Rapier 3D Physics Plugin'

    physicsBodies: PhysicsBodies

    physicsWorld?: PhysicsWorld
    characterController?: KinematicCharacterController

    constructor() {
        this.physicsBodies = new Map()
    }

    init(world: World) {
        getRapier()
            .then((rapier) => {
                const physicsWorld = new rapier.World(GRAVITY_3D)
                const characterController = physicsWorld.createCharacterController(0.01)

                const receiver = makePhysicsBodyReceiver(rapier, physicsWorld, this.physicsBodies)

                world.ecs.addFilterListener(physicsBodyQuery, receiver)

                this.physicsWorld = physicsWorld
                this.characterController = characterController
            })
            .catch(() => {
                log.e('Failed to initialize Rapier3D')
            })

        world.registerSystem(physicsStepSystem())
        world.registerSystem(physicsExportSystem())
    }
}

const physicsStepSystem = createSystem('physics step', () => (world: World) => {
    const { physicsWorld } = world.getPlugin(Rapier3DPlugin)

    physicsWorld?.step()
})

const physicsExportSystem = createSystem('physics export', () => (world: World) => {
    const { physicsBodies } = world.getPlugin(Rapier3DPlugin)
    const entities = world.entities.filterBy(physicsBodyQuery)

    for (const entity of entities) {
        const body = physicsBodies.get(entity.id)
        const bodyPosition = body?.translation()

        if (bodyPosition) {
            const { position } = entity.get(transform3D)

            position[0] = bodyPosition.x
            position[1] = bodyPosition.y
            position[2] = bodyPosition.z
        }
    }
})

const makePhysicsBodyReceiver = (rapier: Rapier, physicsWorld: PhysicsWorld, physicsBodies: PhysicsBodies) => (entity: Entity) => {
    const { shape } = entity.get(collider3D)
    const { mass, velocity } = entity.get(rigidBody3D) ?? entity.get(characterBody3D)
    const { position } = entity.get(transform3D)

    const colliderDesc = makeColliderDescFromShape(rapier, shape).setMass(mass)
    const rigidBodyDesc = mass ? rapier.RigidBodyDesc.dynamic() : rapier.RigidBodyDesc.fixed()

    rigidBodyDesc.setTranslation(...position)
    rigidBodyDesc.setLinvel(...velocity)

    const rigidBody = physicsWorld.createRigidBody(rigidBodyDesc)

    // const collider = physicsWorld.createCollider(colliderDesc, rigidBody)
    physicsWorld.createCollider(colliderDesc, rigidBody)

    physicsBodies.set(entity.id, rigidBody)
}

const makeColliderDescFromShape = (rapier: Rapier, shape: Shape3D): ColliderDesc => {
    switch(shape.type) {
        case 'sphere': {
            const { radius } = shape
            return rapier.ColliderDesc.ball(radius)
        }
        case 'box': {
            const { size } = shape
            return rapier.ColliderDesc.cuboid(size[0] / 2, size[1] / 2, size[2] / 2)
        }
        case 'capsule': {
            const { radius, height } = shape
            const cylinderHeight = height - radius * 2
            return rapier.ColliderDesc.capsule(cylinderHeight / 2, radius)
        }
        default:
            // TODO can we have a better default here?
            return rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    }
}
