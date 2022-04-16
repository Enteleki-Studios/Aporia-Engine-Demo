import { Vector3 } from 'three'
import type { DirectionalLightComponent, PositionComponent, ComponentManager } from 'gengine'
import type { CameraComponent } from 'components'

const camPosition = new Vector3()

export function cameraSystem(componentManager: ComponentManager) {
    componentManager.getTuplesByQueryGeneric<[CameraComponent, DirectionalLightComponent, PositionComponent]>(
        ['camera', 'directionalLight', 'position'],
    ).forEach(([cameraComponent, directionalLightComponent, positionComponent]) => {
        camPosition.set(0, 0, 1)
        camPosition.applyQuaternion(positionComponent.quaternion) // Point camera forward
        camPosition.multiplyScalar(-5) // Move it back
        camPosition.y += 5 // Move it up
        camPosition.add(positionComponent.position) // Move it into position
        cameraComponent.position.copy(camPosition) // Save new position

        cameraComponent.lookAt.copy(positionComponent.position)
        cameraComponent.lookAt.setY(2) // Look a little higher

        directionalLightComponent.position.set(
            positionComponent.position.x + 10,
            15,
            positionComponent.position.z + 10,
        )
        directionalLightComponent.target.copy(positionComponent.position)
        directionalLightComponent.needsUpdate = true
    })
}
