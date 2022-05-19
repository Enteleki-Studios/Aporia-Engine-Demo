import { Quaternion, Vector3 } from 'three'
import { Component } from '../ECS/Component'

export class CameraComponent extends Component {
    position = new Vector3()
    direction = new Quaternion()
    lookAt = new Vector3()
}
