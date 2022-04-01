import { AmbientLight } from 'three'
import { Component } from '../ECS/Component'
import { AMBIENT_LIGHT } from './componentTypes'

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

    inspect() {
        return {
            ...super.inspect(),
            color: `#${this.color.toString(16)}`,
            intensity: this.intensity,
        }
    }
}
