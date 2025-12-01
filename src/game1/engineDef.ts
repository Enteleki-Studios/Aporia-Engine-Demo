import { glMatrix, quat, vec3 } from 'gl-matrix'

import { Y_AXIS } from '@core'

import {
    Geometry3DComponent,
    PlayerComponent,
    Transform3DComponent,
    Velocity3DComponent,
} from '@core/components'

import { createQuery } from '@pluginEntities'
import { RigidBodyDynamic, RigidBodyFixed, RigidBodyKinematic } from '@pluginRapier3D'
import {
    Animation,
    GltfComponent,
    PerspectiveCamera,
    perspectiveCameraQuery,
    RenderableDynamic,
    RenderableFixed,
} from '@pluginThree'

import { type World, createWorld } from './createWorld'
import { quatLookAt } from '@core/utils'

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

        if (character && characterCollider) {
            const dirX = input.left ? -1 : input.right ? 1 : 0
            const dirZ = input.up ? -1 : input.down ? 1 : 0

            // Target movement speed
            const speed = input.shift ? 7 : 1.25

            const targetVelocity: vec3 = [dirX, 0, dirZ]
            vec3.normalize(targetVelocity, targetVelocity)
            vec3.scale(targetVelocity, targetVelocity, speed)

            // Manually set vertical speed
            targetVelocity[1] = input.space ? 10 : -9.81

            vec3.lerp(velocity, velocity, targetVelocity, 1 - 0.005 ** delta)

            const isGrounded = characterController.computedGrounded()

            // Slightly downward while walking on the ground
            if (isGrounded && !input.space) {
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
            } else if (isMoving) {
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

                // Update camera position and rotation
                if (cameraResult) {
                    const [[_, camTransform]] = cameraResult

                    camTransform.position[0] = transform.position[0]
                    camTransform.position[1] = transform.position[1] + 3
                    camTransform.position[2] = transform.position[2] + 5

                    const rotVec = vec3.subtract([], transform.position, camTransform.position)
                    rotVec[1] += 1
                    quatLookAt(camTransform.rotation, rotVec)
                }
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
        PerspectiveCamera({ far: 5000 }),
        Transform3DComponent(),
    )

    // Create player
    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        PlayerComponent(),
        RigidBodyKinematic(),
        Geometry3DComponent({
            type: 'capsule',
            halfHeight: 0.5,
            radius: 0.4,
        }),
        Transform3DComponent({ position: [-3, 10, 0] }),
        RenderableDynamic(),
        GltfComponent({
            path: '/humanoid/animated_robo.glb',
        }),
        Animation({ actionName: 'Idle_Loop' }),
        Velocity3DComponent(),
    )

    for (let i = 0; i < 10; i++) {
        world.resources.entities.addComponents(
            world.resources.entities.createEntity(),
            Transform3DComponent({ position: [i * 2, 10, -i * 2] }),
            RigidBodyDynamic(),
            Geometry3DComponent({ type: 'ball', radius: 0.5 }),
            RenderableDynamic(),
        )
    }

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        Transform3DComponent({ position: [0, 10, -25] }),
        RigidBodyFixed(),
        Geometry3DComponent({
            type: 'box',
            halfWidth: 10,
            halfHeight: 10,
            halfDepth: 10,
        }),
        RenderableFixed(),
    )

    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        Transform3DComponent({ position: [0, 1, 0] }),
        RigidBodyFixed(),
        Geometry3DComponent({
            type: 'wedge',
            halfWidth: 15,
            halfHeight: 5,
            halfDepth: 5,
        }),
        RenderableFixed(),
    )

    const generateHeightfield = (ncols: number, nrows: number = ncols) => {
        const heights = []

        for (let i = 0; i <= ncols; i++) {
            for (let j = 0; j <= nrows; j++) {
                heights.push(Math.random())
                // heights.push(1)
                // heights.push(i / ncols)
                // heights.push(i / ncols + j / nrows)
            }
        }

        return heights
    }

    const size = 40
    const scale = 20
    world.resources.entities.addComponents(
        world.resources.entities.createEntity(),
        RigidBodyFixed(),
        Transform3DComponent({
            position: [0, -1.5, 0],
        }),
        Geometry3DComponent({
            type: 'heightfield',
            ncols: size,
            nrows: size,
            heights: generateHeightfield(size, size),
            scale: [size * scale, 5, size * scale],
        }),
    )

    // world.resources.three.renderer.camera.position.set(2, 4, 7)
    // world.resources.three.renderer.camera.lookAt(new Vector3(0, 1, 0))

    return world
}
