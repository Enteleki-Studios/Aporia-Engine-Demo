import { Vector3 } from 'three'
import type { PositionComponent, ComponentManager } from 'gengine'
import type { CameraComponent } from 'components'

const camPosition = new Vector3()

export function cameraSystem(componentManager: ComponentManager) {
    componentManager.getTuplesByQueryGeneric<[CameraComponent, PositionComponent]>(
        ['camera', 'position'],
    ).forEach(([cameraComponent, positionComponent]) => {
        camPosition.set(0, 0, 1)
        camPosition.applyQuaternion(positionComponent.quaternion) // Point camera forward
        camPosition.multiplyScalar(-5) // Move it back
        camPosition.y += 5 // Move it up
        camPosition.add(positionComponent.position) // Move it into position
        cameraComponent.position.copy(camPosition) // Save new position

        cameraComponent.lookAt.copy(positionComponent.position)
        cameraComponent.lookAt.setY(2) // Look a little higher
    })
}
