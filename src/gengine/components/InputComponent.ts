import type { Keymap } from '../constants'
import { Component } from '../ECS/Component'

export class InputComponent extends Component {
    input: Record<string, { press: boolean, hold: boolean }> = {}
    mouse: {
        pan: {
            x: number
            y: number
        }
    }

    constructor(keymap: Keymap) {
        super()

        this.mouse = {
            pan: {
                x: 0,
                y: 0,
            },
        }

        Object.keys(keymap).forEach((action) => {
            this.input[action] = {
                press: false,
                hold: false,
            }
        })
    }
}
