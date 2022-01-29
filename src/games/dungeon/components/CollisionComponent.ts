import { Vector2 } from 'three'
import { Component } from 'gengine'
import { COLLISION } from './types'

export class CollisionComponent extends Component {
    type = COLLISION
    collisions: [('WALL'), Vector2][] = []
    numCollisions = 0

    inspect() {
        return {
            ...super.inspect(),
            collisions: this.numCollisions,
        }
    }
}
