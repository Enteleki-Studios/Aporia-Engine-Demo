import { Vec3 } from 'gl-matrix/dist/esm'
import {
    createSystem,
    transform3D,
    velocityComponent,
    ORIGIN,
    World,
    heroFilter,
    movingEntitiesFilter,
} from '@gengine/core'

import { Capsule, Octree } from '@gengine/plugin-threejs'
// import { CollidableComponent } from 'dungeon/components'

// TODO just selecting the hero for now
export const collisionsFilter = heroFilter.and(movingEntitiesFilter)

export const collisionSystem = createSystem<{ octree: Octree }>('collisions', ({ octree }) => {
    const playerCollider = new Capsule(undefined, undefined, 0.5)

    return (world: World) => {
        for (const heroEntity of world.ecs.filterBy(collisionsFilter)) {
            const { position } = heroEntity.get(transform3D)
            const { velocity } = heroEntity.get(velocityComponent)

            // Capsule(start, end, radius)
            // const playerCollider = new Capsule(position, position.clone().setY(2), 0.5)
            playerCollider.start.fromArray(position)
            playerCollider.end.fromArray(position).setY(2)

            const collisionResult = octree.capsuleIntersect(playerCollider)
            if (collisionResult) {
                const { normal } = collisionResult

                const collisionVector = new Vec3(normal.x, normal.y, normal.z)
                if (Vec3.dot(collisionVector, velocity) < 0) {
                    // Rotate 90 degrees to get tangent vector
                    Vec3.rotateY(collisionVector, collisionVector, ORIGIN, -Math.PI / 2)

                    // Project velocity onto tangent
                    Vec3.scale(velocity, collisionVector, Vec3.dot(collisionVector, velocity))
                }
            }
        }
    }
})

// export class CollisionSystem extends System {
//     solidFilter = new ECSFilter([HitboxComponent, PositionComponent])
//     movingFilter = new ECSFilter([CollidableComponent, HitboxComponent, PositionComponent, VelocityComponent])

//     filters = [this.solidFilter, this.movingFilter]

//     tick(world: World) {
//         this.movingFilter.entities.forEach((movingEntity) => {
//             const movingHitboxComponent = movingEntity.get(HitboxComponent)
//             const movingPositionComponent = movingEntity.get(PositionComponent)
//             const movingVelocityComponent = movingEntity.get(VelocityComponent)

//             this.solidFilter.entities.forEach((solidEntity) => {
//                 const solidHitboxComponent = solidEntity.get(HitboxComponent)
//                 const solidPositionComponent = solidEntity.get(PositionComponent)

//                 // No self collision
//                 if (movingEntity.id === solidEntity.id) {
//                     return
//                 }

//                 const movementVector = movingVelocityComponent.velocity.clone()

//                 // Minimum distance
//                 const testDist = (movingHitboxComponent.radius + solidHitboxComponent.radius) ** 2
//                 const nextPosition = movingPositionComponent.position.clone().add(
//                     movementVector.clone().multiplyScalar(world.timeElapsedS),
//                 )
//                 // Distance between next position and solid object
//                 const distance = nextPosition.distanceToSquared(solidPositionComponent.position)

//                 if (distance <= testDist) {
//                     const collisionVector = movingPositionComponent.position.clone()
//                     collisionVector.sub(solidPositionComponent.position)
//                     // Rotate 90 degrees to get tangent vector
//                     collisionVector.applyAxisAngle(Y_AXIS, -Math.PI / 2)

//                     movementVector.projectOnVector(collisionVector)

//                     movingVelocityComponent.velocity.copy(movementVector)
//                 }
//             })
//         })
//     }
// }
