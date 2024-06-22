import type {
    Collider,
    ColliderDesc,
    KinematicCharacterController,
    World as PhysicsWorld,
    RigidBody,
} from '@dimforge/rapier3d'

import {
    ECSFilter,
    type Entity,
    EntityId,
    type Plugin,
    Shape3D,
    type World,
    characterController,
    collider3D,
    createSystem,
    log,
    rigidBody3D,
    transform3D,
    velocityComponent,
} from '@gengine/core'

import { type Rapier, getRapier } from './rapier'

type PhysicsBodies = Map<EntityId, RigidBody>
type PhysicsColliders = Map<EntityId, Collider>

const GRAVITY_3D = { x: 0, y: -9.81, z: 0 }

export const physicsBodyQuery = ECSFilter.of([transform3D, collider3D, rigidBody3D])
export const physicsCharacterQuery = physicsBodyQuery.with([characterController])

export class Rapier3DPlugin implements Plugin {
    name = 'Rapier 3D Physics Plugin'

    physicsBodies: PhysicsBodies
    physicsColliders: PhysicsColliders

    physicsWorld?: PhysicsWorld
    characterController?: KinematicCharacterController

    constructor() {
        this.physicsBodies = new Map()
        this.physicsColliders = new Map()
    }

    init(world: World) {
        world.registerSystem(physicsStepSystem())
        world.registerSystem(physicsExportSystem())

        getRapier()
            .then((rapier) => {
                const physicsWorld = new rapier.World(GRAVITY_3D)
                const characterController = physicsWorld.createCharacterController(0.01)

                characterController.enableSnapToGround(0.5)
                characterController.enableAutostep(0.5, 0.2, true)
                characterController.setMaxSlopeClimbAngle((45 * Math.PI) / 180)
                characterController.setMinSlopeSlideAngle((30 * Math.PI) / 180)
                characterController.setApplyImpulsesToDynamicBodies(true)

                const receiver = makePhysicsBodyReceiver(
                    rapier,
                    physicsWorld,
                    this.physicsBodies,
                    this.physicsColliders,
                )

                world.ecs.addFilterListener(physicsBodyQuery, receiver)

                this.physicsWorld = physicsWorld
                this.characterController = characterController
            })
            .catch(() => {
                log.e('Failed to initialize Rapier3D')
            })
    }
}

const physicsStepSystem = createSystem('physics step', () => {
    const inputVelocityVector = { x: 0, y: 0, z: 0 }
    const outputPosition = { x: 0, y: 0, z: 0 }

    return (world: World) => {
        const { physicsWorld, characterController, physicsColliders, physicsBodies } = world.getPlugin(Rapier3DPlugin)

        if (physicsWorld) {
            physicsWorld.timestep = world.time.delta
            physicsWorld.step()
        }

        if (characterController) {
            const characterEntities = world.entities.filterBy(physicsCharacterQuery)

            for (const character of characterEntities) {
                const collider = physicsColliders.get(character.id)
                const body = physicsBodies.get(character.id)
                const { velocity } = character.get(velocityComponent)

                if (body && collider && velocity) {
                    inputVelocityVector.x = velocity[0] * world.time.delta
                    inputVelocityVector.y = (velocity[1] - 5) * world.time.delta // TODO configurable gravity
                    inputVelocityVector.z = velocity[2] * world.time.delta
                    characterController.computeColliderMovement(collider, inputVelocityVector)
                    const correctedMovement = characterController.computedMovement()
                    outputPosition.x = body.translation().x + correctedMovement.x
                    outputPosition.y = body.translation().y + correctedMovement.y
                    outputPosition.z = body.translation().z + correctedMovement.z
                    body.setNextKinematicTranslation(outputPosition)
                    console.debug(correctedMovement)
                }
            }
        }
    }
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

const makePhysicsBodyReceiver =
    (rapier: Rapier, physicsWorld: PhysicsWorld, physicsBodies: PhysicsBodies, physicsColliders: PhysicsColliders) =>
    (entity: Entity) => {
        const { shape, friction, restitution, isSensor } = entity.get(collider3D)
        const { mass, velocity } = entity.get(rigidBody3D)
        const { position } = entity.get(transform3D)

        const isCharacter = entity.has(characterController)

        const colliderDesc = makeColliderDescFromShape(rapier, shape).setMass(mass).setSensor(isSensor)
        const rigidBodyDesc = isCharacter
            ? rapier.RigidBodyDesc.kinematicPositionBased()
            : mass
              ? rapier.RigidBodyDesc.dynamic()
              : rapier.RigidBodyDesc.fixed()

        if (friction !== null) {
            colliderDesc.setFriction(friction)
        }
        if (restitution !== null) {
            colliderDesc.setRestitution(restitution)
        }

        rigidBodyDesc.setTranslation(...position)
        rigidBodyDesc.setLinvel(...velocity)

        const rigidBody = physicsWorld.createRigidBody(rigidBodyDesc)
        const collider = physicsWorld.createCollider(colliderDesc, rigidBody)

        physicsBodies.set(entity.id, rigidBody)
        physicsColliders.set(entity.id, collider)
    }

const makeColliderDescFromShape = (rapier: Rapier, shape: Shape3D): ColliderDesc => {
    switch (shape.type) {
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
