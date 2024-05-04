import { cameraComponent, transform3D } from 'components'
import { type World, createSystem } from 'core'
import { cameraFilter, cameraTargetFilter } from 'filters'

import { Vec3, Vec3Like } from 'gl-matrix'

const camPosition: Vec3Like = [0, 0, 0]

export const thirdPersonCameraSystem = createSystem('third-person camera', () => (world: World) => {
    const delta = world.timeElapsedS
    const [cameraTarget] = world.ecs.filterBy(cameraTargetFilter)

    for (const cameraEntity of world.ecs.filterBy(cameraFilter)) {
        const { position, lookAt } = cameraEntity.get(cameraComponent)
        const { position: targetPosition } = cameraTarget.get(transform3D)

        Vec3.copy(camPosition, targetPosition)
        Vec3.add(camPosition, camPosition, [5, 7, 7])

        Vec3.lerp(position, position, camPosition, 1 - 0.005 ** delta)
        // cameraComponent.lookAt.lerp(targetPosition, 1 - (0.00001 ** delta))
        Vec3.lerp(lookAt, lookAt, targetPosition, 1 - 0.005 ** delta)
        // cameraComponent.position.copy(camPosition)
        // cameraComponent.lookAt.copy(targetPosition)
    }
})
// Panning
// forwardQ.setFromAxisAngle(Y_AXIS, -2 * Math.PI * inputComponent.mouse.pan.x * delta * 0.01)
