import System from 'ECS/System'
import * as THREE from 'three'

export class Movement extends System {
    constructor() {
        super([
            'playerControl',
            'position',
            'animation',
            'singletonInput',
        ])

        this._controlledEntities = []

        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
        // this._acceleration = new THREE.Vector3(1, 0.4, 20.0)
        this._acceleration = new THREE.Vector3(1, 10, 20.0)
        this._velocity = new THREE.Vector3(0, 0, 0)
    }

    addComponent(component) {
        switch (component.type) {
            case 'playerControl':
                this._controlledEntities.push(component.entity)
                break
            default:
                break
        }
        this._saveComponent(component)
    }

    // Cardinal direction movement
    tick(delta) {
        this._controlledEntities.forEach((entity) => {
            const input = this._getComponent(entity, 'singletonInput')
            const positionComponent = this._getComponent(entity, 'position')
            const animationComponent = this._getComponent(entity, 'animation')

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

            const _Q = new THREE.Quaternion()
            const _A = new THREE.Vector3()
            const _R = positionComponent.quaternion.clone()

            // TODO: Copy acceleration and apply scalar if we need to pause or run

            const acceleration = this._acceleration.clone()
            if (input.run) {
                acceleration.multiplyScalar(2)
            }

            if (input.forward) {
                velocity.z += acceleration.z * delta
                let nextState = 'walk'
                if (input.run) {
                    nextState = 'run'
                }
                if (animationComponent.state !== nextState) {
                    animationComponent._prevState = animationComponent.state
                    animationComponent.state = nextState
                    animationComponent._needsUpdate = true
                }
            } else if (animationComponent.state !== 'idle') {
                animationComponent._prevState = animationComponent.state
                animationComponent.state = 'idle'
                animationComponent._needsUpdate = true
            }

            if (input.upHold) {
                _A.set(0, 1, 0)
                _Q.setFromAxisAngle(_A, 0 * Math.PI)
                _R.slerp(_Q, delta * acceleration.y)
            }
            if (input.downHold) {
                _A.set(0, 1, 0)
                _Q.setFromAxisAngle(_A, 1 * Math.PI)
                _R.slerp(_Q, delta * acceleration.y)
            }
            if (input.leftHold) {
                _A.set(0, 1, 0)
                _Q.setFromAxisAngle(_A, 0.5 * Math.PI)
                _R.slerp(_Q, delta * acceleration.y)
            }
            if (input.rightHold) {
                _A.set(0, 1, 0)
                _Q.setFromAxisAngle(_A, 1.5 * Math.PI)
                _R.slerp(_Q, delta * acceleration.y)
            }

            positionComponent.quaternion.copy(_R)

            const forward = new THREE.Vector3(0, 0, 1)
            forward.applyQuaternion(positionComponent.quaternion)
            forward.normalize()
            forward.multiplyScalar(velocity.z * delta)

            const sideways = new THREE.Vector3(1, 0, 1)
            sideways.applyQuaternion(positionComponent.quaternion)
            sideways.normalize()
            sideways.multiplyScalar(velocity.x * delta)

            positionComponent.position.add(forward)
            positionComponent.position.add(sideways)

            positionComponent._needsUpdate = true
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

    //         // TODO: Copy acceleration and apply scalar if we need to pause or run

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
