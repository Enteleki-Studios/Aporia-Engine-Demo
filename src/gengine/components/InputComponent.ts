import { Component } from '../ECS/Component'

export class InputComponent extends Component {
    type = 'input'
    input: Record<string, { press: boolean, hold: boolean }> = {}
}
