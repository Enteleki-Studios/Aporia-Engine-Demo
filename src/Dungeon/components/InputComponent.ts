import { Vector3 } from 'three'
import { Component } from 'ECS'
import { INPUT } from './types'

export class InputComponent extends Component {
    type = INPUT

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

    pan = new Vector3()
}
