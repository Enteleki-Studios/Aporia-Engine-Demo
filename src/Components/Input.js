import { Vector3 } from 'three'
import { INPUT } from './types'

export default function Input(entity) {
    return {
        type: INPUT,
        entity,

        forward: false,
        run: false,

        upPress: false,
        upHold: false,

        leftPress: false,
        leftHold: false,

        rightPress: false,
        rightHold: false,

        downPress: false,
        downHold: false,

        pan: new Vector3(0, 0, 0),
    }
}
