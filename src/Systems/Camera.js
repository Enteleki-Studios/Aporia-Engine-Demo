import { Vector3 } from 'three'
import { System } from 'ECS'
import { CAMERA, LIGHT, POSITION } from 'Components/types'

// const LERP_FACTOR = 3
let camPosition
let lookPosition

export class Camera extends System {
    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([CAMERA, LIGHT, POSITION]).forEach(
            ([cameraComponent, lightComponent, positionComponent]) => {
                camPosition = new Vector3(0, 0, 1)
                camPosition.applyQuaternion(positionComponent.quaternion)
                camPosition.normalize()
                camPosition.multiplyScalar(-4)
                camPosition.y += 2
                // camPosition.x -= 1
                camPosition.add(positionComponent.position)
                // cameraComponent.position.lerp(new Vector3(
                //     positionComponent.position.x + 1,
                //     3,
                //     positionComponent.position.z - 6,

                // ), delta * LERP_FACTOR)
                cameraComponent.position.copy(camPosition)

                lookPosition = new Vector3(0, 0, 1)
                lookPosition.applyQuaternion(positionComponent.quaternion)
                lookPosition.normalize()
                lookPosition.multiplyScalar(3)
                // lookPosition.y += 1
                lookPosition.add(positionComponent.position)

                // cameraComponent.lookAt.lerp(positionComponent.position, delta * LERP_FACTOR)
                cameraComponent.lookAt.copy(lookPosition)
                cameraComponent.needsUpdate = true

                lightComponent.position.set(
                    positionComponent.position.x + 10,
                    15,
                    positionComponent.position.z + 10,
                )
                lightComponent.target.copy(positionComponent.position)
                lightComponent.needsUpdate = true
            },
        )
    }
}
