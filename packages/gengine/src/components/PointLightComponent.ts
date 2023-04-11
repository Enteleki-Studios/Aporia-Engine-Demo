import { Component } from '../ecs'

type PointLightSettings = {
    color: number
    intensity: number
    distance?: number
    decay?: number
    offset?: [number, number, number]
    castShadow?: boolean
}

export class PointLightComponent extends Component {
    color: number
    intensity: number
    distance: number
    decay: number
    offset: [number, number, number]
    castShadow: boolean

    constructor({
        color,
        intensity,
        distance = 0,
        decay = 2,
        offset = [0, 0, 0],
        castShadow = false,
    }: PointLightSettings) {
        super()
        this.color = color
        this.intensity = intensity
        this.distance = distance
        this.decay = decay
        this.offset = offset
        this.castShadow = castShadow
    }
}
