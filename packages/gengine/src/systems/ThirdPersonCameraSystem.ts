import { Vec3, Vec3Like } from 'gl-matrix/dist/esm'

import { positionComponent, cameraComponent, cameraTargetComponent } from '../components'
import { ECSFilter, System } from '../ecs'
import { World } from '../World'

const camPosition: Vec3Like = [0, 0, 0]

export class ThirdPersonCameraSystem implements System {
    cameraTargetFilter = new ECSFilter([CameraTargetComponent, PositionComponent])
    cameraFilter = new ECSFilter([CameraComponent])

    filters = [this.cameraTargetFilter, this.cameraFilter]

    tick(world: World) {
        const delta = world.timeElapsedS
        const cameraTargets = [...this.cameraTargetFilter.entities]

        this.cameraFilter.entities.forEach((cameraEntity) => {
            const { position, lookAt } = cameraEntity.get(CameraComponent)
            const { position: targetPosition } = cameraTargets[0].get(PositionComponent)

            Vec3.copy(camPosition, targetPosition)
            Vec3.add(camPosition, camPosition, [5, 7, 7])

            Vec3.lerp(position, position, camPosition, 1 - 0.005 ** delta)
            // cameraComponent.lookAt.lerp(targetPosition, 1 - (0.00001 ** delta))
            Vec3.lerp(lookAt, lookAt, targetPosition, 1 - 0.005 ** delta)
            // cameraComponent.position.copy(camPosition)
            // cameraComponent.lookAt.copy(targetPosition)
        })
    }
}
// Panning
// forwardQ.setFromAxisAngle(Y_AXIS, -2 * Math.PI * inputComponent.mouse.pan.x * delta * 0.01)
