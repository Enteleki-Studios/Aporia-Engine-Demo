import { Vector2 } from 'three'
import { Component } from 'gengine'
import { COLLISION } from './types'

export class CollisionComponent extends Component {
    type = COLLISION
    collisions: [string, Vector2][] = []
}
