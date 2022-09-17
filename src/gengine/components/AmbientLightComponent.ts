import { Component } from '../ECS/Component'

interface Settings {
    color: number,
    intensity: number,
}

export class AmbientLightComponent extends Component {
    color: number
    intensity: number

    constructor({ color, intensity }: Settings) {
        super()

        this.color = color
        this.intensity = intensity
    }
}
