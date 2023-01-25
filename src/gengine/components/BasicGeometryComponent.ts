import { Component } from '../ecs'

type GeometryType = 'box'

export class BasicGeometryComponent extends Component {
    geometryType: GeometryType

    constructor(geometryType: GeometryType) {
        super()

        this.geometryType = geometryType
    }
}
