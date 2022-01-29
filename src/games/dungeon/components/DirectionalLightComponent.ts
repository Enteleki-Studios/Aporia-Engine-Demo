import { Component } from 'gengine'
import { Vector3 } from 'three'
import type { DirectionalLight } from 'systems/Renderer/GLHelpers'
import { DIRECTIONAL_LIGHT } from './types'

export class DirectionalLightComponent extends Component {
    type = DIRECTIONAL_LIGHT
    position: Vector3
    target: Vector3
    needsUpdate = true
    resource: (DirectionalLight | null) = null

    constructor(entityId: string) {
        super(entityId)

        this.position = new Vector3()
        this.target = new Vector3()
    }
}
