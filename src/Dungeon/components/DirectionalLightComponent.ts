import { Component } from 'ECS'
import { Vector3 } from 'three'
import type { DirectionalLight } from 'GLHelpers'
import { DIRECTIONAL_LIGHT } from './types'

export class DirectionalLightComponent extends Component {
    position: Vector3
    target: Vector3
    needsUpdate = true
    resource: (DirectionalLight | null) = null

    constructor(entityId: number) {
        super(DIRECTIONAL_LIGHT, entityId)

        this.position = new Vector3()
        this.target = new Vector3()
    }
}
