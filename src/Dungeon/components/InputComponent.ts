import { Vector3 } from 'three'
import { Component } from 'ECS'
import { INPUT } from './types'

export class InputComponent extends Component {
    forward = false
    run = false
    attacking = false

    upPress = false
    upHold = false

    leftPress = false
    leftHold = false

    rightPress = false
    rightHold = false

    downPress = false
    downHold = false

    pan: Vector3

    constructor(entityId: number) {
        super(INPUT, entityId)
        this.pan = new Vector3(0, 0, 0)
    }
}
