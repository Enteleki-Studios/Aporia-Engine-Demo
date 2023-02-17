import { Component } from '../ecs'

type GeometryType = 'box'

type BasicGeometryComponentSettings = {
    geometryType: GeometryType
    radius?: number
}

export class BasicGeometryComponent extends Component {
    geometryType: GeometryType
    radius: number

    constructor({ geometryType, radius }: BasicGeometryComponentSettings) {
        super()

        this.geometryType = geometryType
        this.radius = radius || 0.5
    }
}
