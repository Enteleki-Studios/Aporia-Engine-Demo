import { Component } from 'gengine'

export class CollidesComponent extends Component {
    type = 'collides'
    radius: number

    constructor(entityId: string, radius: number) {
        super(entityId)

        this.radius = radius
    }
}
