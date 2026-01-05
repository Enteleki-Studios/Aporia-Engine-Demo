import { glMatrix, quat, vec3 } from 'gl-matrix'

import { Ball, Box, Capsule, HeightField, Wedge, Y_AXIS } from '@core'

import {
    Geometry3DComponent,
    PlayerComponent,
    Shape3DComponent,
    Transform3DComponent,
    Velocity3DComponent,
} from '@core/components'
import { clamp, wrapAnglePi } from '@core/utils'

import { createQuery } from '@pluginEntities'
import {
    ColliderComponent,
    RigidBodyDynamic,
    RigidBodyFixed,
    RigidBodyKinematic,
} from '@pluginRapier3D'
import {
    Animation,
    GltfComponent,
    PerspectiveCamera,
    RenderableDynamic,
    RenderableFixed,
    perspectiveCameraQuery,
} from '@pluginThree'

import { type World, createWorld } from './createWorld'

const playerQuery = createQuery([
    Transform3DComponent,
    Animation,
    Velocity3DComponent,
    PlayerComponent,
])

const playerMovementSystem = (world: World) => {
    const { delta } = world.clock
    const { input } = world.resources
    const entities = world.resources.entities.query(playerQuery)
    const cameraResult = world.resources.entities.queryFirst(perspectiveCameraQuery)
    const { characterController, bodies, colliders } = world.resources.physics

    entities.forEach(([[transform, animation, { velocity }], entity]) => {
        const character = bodies.get(entity.id)
        const characterCollider = colliders.get(entity.id)

        if (character && characterCollider && cameraResult) {
            const [[camera, camTransform]] = cameraResult

            // Increment yaw and pitch by input amount
            camera.yaw += input.mouse.panX * -1 * delta
            camera.yaw = wrapAnglePi(camera.yaw)
            camera.pitch += input.mouse.panY * -1 * delta
            camera.pitch = clamp(camera.pitch, -Math.PI / 3.5, Math.PI / 3.5)

            // Apply yaw and pitch
            quat.identity(camTransform.rotation)
            quat.rotateY(camTransform.rotation, camTransform.rotation, camera.yaw)
            quat.rotateX(camTransform.rotation, camTransform.rotation, camera.pitch)

            // Set camera position to a distance along the camera direction
            const camDirection = vec3.transformQuat([], [0, 0, -7], camTransform.rotation)
            camTransform.position[0] = transform.position[0] - camDirection[0]
            camTransform.position[1] = transform.position[1] - camDirection[1] + 2
            camTransform.position[2] = transform.position[2] - camDirection[2]

            const dirX = input.actions.left ? -1 : input.actions.right ? 1 : 0
            const dirZ = input.actions.up ? -1 : input.actions.down ? 1 : 0

            // Target movement speed
            const speed = input.actions.shift ? 7 : 1.25

            const targetVelocity: vec3 = [dirX, 0, dirZ]
            vec3.normalize(targetVelocity, targetVelocity)
            // Rotate velocity by camera yaw so that "forwards" is away from the camera
            vec3.rotateY(targetVelocity, targetVelocity, [0, 0, 0], camera.yaw)
            // Scale velocity up to speed
            vec3.scale(targetVelocity, targetVelocity, speed)

            // Manually set vertical speed
            targetVelocity[1] = input.actions.space ? 10 : -9.81

            vec3.lerp(velocity, velocity, targetVelocity, 1 - 0.005 ** delta)

            // Check if grounded last frame
            const isGrounded = characterController.computedGrounded()

            // Slightly downward while walking on the ground
            if (isGrounded && !input.actions.space) {
                velocity[1] = -0.01
            }

            const vMag2 = vec3.squaredLength(velocity)
            const isMoving = vMag2 > 0.01
            const isRunning = vMag2 > 9

            const desiredTranslation = vec3.scale([], velocity, delta)

            // Compute player movement with physics engine
            characterController.computeColliderMovement(characterCollider, {
                x: desiredTranslation[0],
                y: desiredTranslation[1],
                z: desiredTranslation[2],
            })
            const movement = characterController.computedMovement()
            const newPos = character.translation()
            newPos.x += movement.x
            newPos.y += movement.y
            newPos.z += movement.z
            character.setNextKinematicTranslation(newPos)

            // Update player model animation
            if (!isGrounded) {
                animation.actionName = 'Jump_Loop'
            } else if (isMoving && vMag2 > 0.1) {
                if (isRunning) {
                    animation.actionName = 'Jog_Fwd_Loop'
                } else {
                    animation.actionName = 'Walk_Loop'
                }
            } else {
                animation.actionName = 'Idle_Loop'
            }

            if (isMoving) {
                // Rotate character to face direction of movement
                const angle = Math.atan2(velocity[0], velocity[2])
                const t = 10 * delta
                const targetQ = quat.setAxisAngle([0, 0, 0, 1], Y_AXIS, angle)
                quat.slerp(transform.rotation, transform.rotation, targetQ, t)
            }

            // Teleport player if out of bounds
            if (transform.position[1] < -30) {
                character.setNextKinematicTranslation({
                    x: 0,
                    y: 10,
                    z: 0,
                })
            }
        }
    })
}

export const game1 = async () => {
    glMatrix.setMatrixArrayType(Array)

    const world = await createWorld()

    world.addSystem(playerMovementSystem)

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        Transform3DComponent({ position: [0, 10, 7] }),
        PerspectiveCamera({ far: 5000 }),
    )

    // Create player
    const playerShape: Capsule = {
        type: 'capsule',
        halfHeight: 0.5,
        radius: 0.4,
    }

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        PlayerComponent(),
        Transform3DComponent({ position: [0, 10, 0] }),
        Velocity3DComponent(),
        RenderableDynamic(),
        Geometry3DComponent(playerShape),
        GltfComponent({
            path: '/humanoid/animated_robo.glb',
        }),
        Animation({ actionName: 'Idle_Loop' }),
        RigidBodyKinematic(),
        ColliderComponent(Shape3DComponent(playerShape)),
    )

    const ballShape: Ball = { type: 'ball', radius: 0.5 }
    for (let i = 0; i < 10; i++) {
        world.resources.entities.addComponents(
            world.resources.entities.createEntity(),
            Transform3DComponent({ position: [i * 2, 10, -i * 2] }),
            RigidBodyDynamic(),
            Geometry3DComponent(ballShape),
            RenderableDynamic(),
            ColliderComponent(Shape3DComponent(ballShape)),
        )
    }

    const boxShape: Box = {
        type: 'box',
        halfWidth: 10,
        halfHeight: 10,
        halfDepth: 10,
    }

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        Transform3DComponent({ position: [0, 10, -25] }),
        RigidBodyFixed(),
        Geometry3DComponent(boxShape),
        RenderableFixed(),
        ColliderComponent(Shape3DComponent(boxShape)),
    )

    const wedgeShape: Wedge = {
        type: 'wedge',
        halfWidth: 15,
        halfHeight: 5,
        halfDepth: 5,
    }
    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        Transform3DComponent({ position: [0, 1, 0] }),
        RenderableFixed(),
        Geometry3DComponent(wedgeShape),
        RigidBodyFixed(),
        ColliderComponent(Shape3DComponent(wedgeShape)),
    )

    const generateHeightfield = (ncols: number, nrows: number = ncols) => {
        const heights = []

        for (let i = 0; i <= ncols; i++) {
            for (let j = 0; j <= nrows; j++) {
                heights.push(Math.random())
                // heights.push(1)
                // heights.push((Math.random() + 0.2) * i * j * 0.01)
            }
        }

        return heights
    }

    const size = 40
    const scale = 20
    const heightfield: HeightField = {
        type: 'heightfield',
        ncols: size,
        nrows: size,
        heights: generateHeightfield(size, size),
        scale: [size * scale, 5, size * scale],
    }
    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        Transform3DComponent({
            position: [0, -1.5, 0],
        }),
        Geometry3DComponent(heightfield),
        RigidBodyFixed(),
        ColliderComponent(Shape3DComponent(heightfield)),
    )

    return world
}
