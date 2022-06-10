import { Vector3 } from 'three'

import { Component } from 'gengine'

export class CollidableComponent extends Component {
    collisions: Vector3[] = []
}
