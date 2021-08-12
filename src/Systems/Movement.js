import System from 'ECS/System'
import { INPUT, POSITION } from 'Components/types'
import * as THREE from 'three'

export class Movement extends System {
    constructor() {
        super()

        this._decceleration = new THREE.Vector3(-5, -0.0001, -5)
        this._acceleration = new THREE.Vector3(15, 0.01, 15)
        this._velocity = new THREE.Vector3(0, 0, 0)
    }

    // Cardinal direction movement
    tick(delta) {
        this.ECS.ComponentManager.getTuplesByQuery([INPUT, POSITION]).forEach(([inputComponent, positionComponent]) => {
            const velocity = this._velocity
            const frameDecceleration = new THREE.Vector3(
                velocity.x * this._decceleration.x,
                velocity.y * this._decceleration.y,
                velocity.z * this._decceleration.z,
            )

            frameDecceleration.multiplyScalar(delta)
            frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
                Math.abs(frameDecceleration.z), Math.abs(velocity.z),
            )

            velocity.add(frameDecceleration)

            const _A = new THREE.Vector3(0, 1, 0)
            const _Q = new THREE.Quaternion()
            const _D = positionComponent.quaternion.clone()
            const _R = positionComponent.rotation.clone()

            const acceleration = this._acceleration.clone()
            if (inputComponent.run) {
                acceleration.multiplyScalar(2)
            }

            if (inputComponent.upHold) {
                velocity.z += acceleration.z * delta
            }
            if (inputComponent.downHold) {
                velocity.z -= acceleration.z * delta
            }
            if (inputComponent.leftHold) {
                velocity.x += acceleration.x * delta
            }
            if (inputComponent.rightHold) {
                velocity.x -= acceleration.x * delta
            }

            _Q.setFromAxisAngle(_A, -2 * Math.PI * inputComponent.pan.x * delta * acceleration.y)
            _D.multiply(_Q)

            positionComponent.quaternion.copy(_D)

            _R.copy(_D)

            let nextAngle = 0
            if (inputComponent.upHold) {
                if (inputComponent.leftHold) {
                    nextAngle = Math.PI / 4
                } else if (inputComponent.rightHold) {
                    nextAngle = Math.PI / -4
                }
            } else if (inputComponent.downHold) {
                if (inputComponent.leftHold) {
                    nextAngle = Math.PI / -4
                } else if (inputComponent.rightHold) {
                    nextAngle = Math.PI / 4
                }
            } else if (inputComponent.leftHold) {
                nextAngle = Math.PI / 2
            } else if (inputComponent.rightHold) {
                nextAngle = Math.PI / -2
            }
            _Q.setFromAxisAngle(_A, nextAngle)
            _R.multiply(_Q)

            positionComponent.rotation.slerp(_R, delta * 8)

            const forward = new THREE.Vector3(0, 0, 1)
            forward.applyQuaternion(_D)
            forward.normalize()
            forward.multiplyScalar(velocity.z * delta)

            const sideways = new THREE.Vector3(1, 0, 0)
            sideways.applyQuaternion(_D)
            sideways.normalize()
            sideways.multiplyScalar(velocity.x * delta)

            positionComponent.position.add(forward)
            positionComponent.position.add(sideways)

            positionComponent.needsUpdate = true
        })
    }

    // Needs moving camera
    // tick(delta) {
    //     this._controlledEntities.forEach((entity) => {
    //         const input = this._getComponent(entity, 'singletonInput')
    //         const position = this._getComponent(entity, 'position')

    //         const velocity = this._velocity
    //         const frameDecceleration = new THREE.Vector3(
    //             velocity.x * this._decceleration.x,
    //             velocity.y * this._decceleration.y,
    //             velocity.z * this._decceleration.z,
    //         )

    //         frameDecceleration.multiplyScalar(delta)
    //         frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
    //             Math.abs(frameDecceleration.z), Math.abs(velocity.z),
    //         )

    //         velocity.add(frameDecceleration)

    //         const _Q = new THREE.Quaternion()
    //         const _A = new THREE.Vector3()
    //         const _R = position.quaternion.clone()

    //         // Copy acceleration and apply scalar if we need to pause or run

    //         if (input.upHold) {
    //             velocity.z += this._acceleration.z * delta
    //         }

    //         if (input.downHold) {
    //             velocity.z -= this._acceleration.z * delta
    //         }

    //         if (input.leftHold) {
    //             _A.set(0, 1, 0)
    //             _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * this._acceleration.y)
    //             _R.multiply(_Q)
    //         }
    //         if (input.rightHold) {
    //             _A.set(0, 1, 0)
    //             _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * this._acceleration.y)
    //             _R.multiply(_Q)
    //         }

    //         position.quaternion.copy(_R)

    //         const forward = new THREE.Vector3(0, 0, 1)
    //         forward.applyQuaternion(position.quaternion)
    //         forward.normalize()
    //         forward.multiplyScalar(velocity.z * delta)

    //         const sideways = new THREE.Vector3(1, 0, 1)
    //         sideways.applyQuaternion(position.quaternion)
    //         sideways.normalize()
    //         sideways.multiplyScalar(velocity.x * delta)

    //         position.position.add(forward)
    //         position.position.add(sideways)

    //         position._needsUpdate = true
    //     })
    // }
}
