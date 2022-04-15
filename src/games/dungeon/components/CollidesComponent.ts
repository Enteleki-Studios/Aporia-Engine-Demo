import { Vector3 } from 'three'

import { Component } from 'gengine'

export class CollidesComponent extends Component {
    type = 'collides'
    collisions: Vector3[] = []
}
