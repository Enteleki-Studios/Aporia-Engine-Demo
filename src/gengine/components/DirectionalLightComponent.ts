import { Vector3 } from 'three'
import { Component } from '../ECS/Component'

export class DirectionalLightComponent extends Component {
    type = 'directionalLight'
    position: Vector3
    target: Vector3
    needsUpdate = true

    constructor(entityId: string) {
        super(entityId)

        this.position = new Vector3()
        this.target = new Vector3()
    }
}
