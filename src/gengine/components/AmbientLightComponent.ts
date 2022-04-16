import { AmbientLight } from 'three'
import { Component } from '../ECS/Component'

interface Settings {
    color: number,
    intensity: number,
}

export class AmbientLightComponent extends Component {
    type = 'ambientLight'
    color: number
    intensity: number
    resource: (AmbientLight | null) = null

    constructor(entityId: string, { color, intensity }: Settings) {
        super(entityId)

        this.color = color
        this.intensity = intensity
    }
}
