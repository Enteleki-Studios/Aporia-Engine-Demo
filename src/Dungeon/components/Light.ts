import { Component } from 'ECS'
import { Vector3 } from 'three'
import type { DirectionalLight } from 'GLHelpers'
import { LIGHT } from './types'

type LightType = ('DirectionalLight')

interface Settings {
    lightType: LightType,
    color?: number,
    intensity?: number,
}

export class Light extends Component {
    lightType: LightType
    color?: number
    intensity?: number
    position: Vector3
    target: Vector3
    needsUpdate = true
    resource: (DirectionalLight | null) = null

    constructor(entityId: number, { lightType, color, intensity }: Settings) {
        super(LIGHT, entityId)

        this.lightType = lightType
        this.color = color
        this.intensity = intensity

        this.position = new Vector3()
        this.target = new Vector3()
    }
}
