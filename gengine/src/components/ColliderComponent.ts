import { Component } from '../ecs'

type CylinderCollider = {
    type: 'cylinder'
    radius: number
    height: number
    resolution: number
}

type BoxCollider = {
    type: 'box'
    width: number
    height: number
    depth: number
}

export type Collider = BoxCollider | CylinderCollider

export class ColliderComponent extends Component {
    collider

    constructor(collider: Collider) {
        super()

        this.collider = collider
    }
}
