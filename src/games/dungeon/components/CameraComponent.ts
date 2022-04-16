import { Vector3 } from 'three'
import { Component } from 'gengine'

export class CameraComponent extends Component {
    type = 'camera'
    position = new Vector3()
    lookAt = new Vector3()
}
