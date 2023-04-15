import { Capsule } from 'three/examples/jsm/math/Capsule'
import {
    ECSFilter,
    HeroComponent,
    PositionComponent,
    System,
    log,
} from 'gengine'
// import { CollidableComponent } from 'dungeon/components'

import { octree } from './RendererSystem'

export class CollisionSystem implements System {
    // TODO just selecting the hero for now
    heroFilter = new ECSFilter([HeroComponent, PositionComponent])

    filters = [this.heroFilter]

    tick() {
        this.heroFilter.entities.forEach((heroEntity) => {
            const { position } = heroEntity.get(PositionComponent)

            // Capsule(start, end, radius)
            const playerCollider = new Capsule(position, position.clone().setY(2), 0.5)
            const collisionResult = octree.capsuleIntersect(playerCollider)
            if (collisionResult) {
                log.d(collisionResult.normal)
            }
        })
    }
}

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
