import { Vector3 } from 'three'
import { Component } from '../ECS/Component'

export class DirectionalLightComponent extends Component {
    offset: [number, number, number]
    position = new Vector3()
    target = new Vector3()

    constructor(entityId: string, offset: [number, number, number]) {
        super(entityId)
        this.offset = offset
    }
}
