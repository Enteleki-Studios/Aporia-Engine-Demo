import { Component } from 'ECS'
import { AmbientLight } from 'three'
import { AMBIENT_LIGHT } from './types'

interface Settings {
    color: number,
    intensity: number,
}

export class AmbientLightComponent extends Component {
    type = AMBIENT_LIGHT
    color: number
    intensity: number
    resource: (AmbientLight | null) = null

    constructor(entityId: string, { color, intensity }: Settings) {
        super(entityId)

        this.color = color
        this.intensity = intensity
    }
}
