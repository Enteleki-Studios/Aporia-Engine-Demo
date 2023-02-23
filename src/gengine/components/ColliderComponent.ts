import { Component } from '../ecs'

type BoxCollider = {
    type: 'box'
    width: number
    height: number
    depth: number
}

type Collider = BoxCollider

export class ColliderComponent extends Component {
    collider

    constructor(collider: Collider) {
        super()

        this.collider = collider
    }
}
