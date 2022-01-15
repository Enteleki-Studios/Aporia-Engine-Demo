import { Vector2 } from 'three'
import { Component } from 'ECS'
import { COLLISION } from './types'

export class CollisionComponent extends Component {
    type = COLLISION
    collisions: [string, Vector2][] = []
}
