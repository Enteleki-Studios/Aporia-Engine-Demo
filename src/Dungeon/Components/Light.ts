import { Component } from 'ECS'
import { Vector3 } from 'three'
import { LIGHT } from './types'

interface Settings {
    lightType: string,
    color: number,
    intensity: number,
}

export class Light extends Component {
    lightType: string
    color: number
    intensity: number
    position: Vector3
    target: Vector3
    needsUpdate = true
    resource: (object | null) = null

    constructor(entity: number, { lightType, color, intensity }: Settings) {
        super(LIGHT, entity)

        this.lightType = lightType
        this.color = color
        this.intensity = intensity

        this.position = new Vector3()
        this.target = new Vector3()
    }
}
