import type { Keymap } from '../constants'
import { Component } from '../ECS/Component'

export class InputComponent extends Component {
    type = 'input'
    input: Record<string, { press: boolean, hold: boolean }> = {}

    constructor(entityId: string, keymap: Keymap) {
        super(entityId)

        Object.keys(keymap).forEach((action) => {
            this.input[action] = {
                press: false,
                hold: false,
            }
        })
    }
}
