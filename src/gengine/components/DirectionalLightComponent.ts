import { Vector3 } from 'three'
import { Component } from '../ECS/Component'

export class DirectionalLightComponent extends Component {
    type = 'directionalLight'
    position = new Vector3()
    target = new Vector3()
}
