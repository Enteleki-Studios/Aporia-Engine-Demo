import { Vector3 } from 'three'
import System from 'ECS/System'
import { CAMERA, LIGHT, POSITION } from 'Components/types'

const LERP_FACTOR = 3

export class Camera extends System {
    tick(delta) {
        this.ECS.ComponentManager.getTuplesByQuery([CAMERA, LIGHT, POSITION]).forEach(
            ([cameraComponent, lightComponent, positionComponent]) => {
                cameraComponent.position.lerp(new Vector3(
                    positionComponent.position.x - 1,
                    4,
                    positionComponent.position.z - 5,

                ), delta * LERP_FACTOR)

                cameraComponent.lookAt.lerp(positionComponent.position, delta * LERP_FACTOR)
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
