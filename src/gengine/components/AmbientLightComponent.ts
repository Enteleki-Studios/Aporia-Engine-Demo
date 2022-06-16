import { AmbientLight } from 'three'
import { Component } from '../ECS/Component'

interface Settings {
    color: number,
    intensity: number,
}

export class AmbientLightComponent extends Component {
    color: number
    intensity: number
    resource: (AmbientLight | null) = null

    constructor({ color, intensity }: Settings) {
        super()

        this.color = color
        this.intensity = intensity
    }
}
