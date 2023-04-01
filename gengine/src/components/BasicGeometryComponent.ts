import { Component } from '../ecs'

type BoxSettings = {
    geometryType: 'box'
    size?: number
}

type SphereSettings = {
    geometryType: 'sphere'
    radius?: number
}

type BasicGeometryComponentSettings = (BoxSettings | SphereSettings) & {
    color?: number
}

type GeometryType = BasicGeometryComponentSettings['geometryType']

export class BasicGeometryComponent extends Component {
    geometryType: GeometryType
    radius?: number
    size?: number
    color: number

    constructor(settings: BasicGeometryComponentSettings) {
        super()

        this.geometryType = settings.geometryType
        this.color = settings.color || 0xffffff

        switch (settings.geometryType) {
            case 'box':
                this.size = settings.size || 1
                break
            case 'sphere':
                this.radius = settings.radius || 1
                break
            default:
                break
        }
    }
}
