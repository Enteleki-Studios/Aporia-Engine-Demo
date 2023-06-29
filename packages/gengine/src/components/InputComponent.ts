import type { Keymap } from 'definitions'
import { Component } from 'ecs'

export class InputComponent extends Component {
    input: Record<string, { press: boolean; hold: boolean }> = {}
    mouse: {
        pan: {
            x: number
            y: number
        }
        position: {
            centerRel: {
                x: number
                y: number
            }
        }
    }

    constructor(keymap: Keymap) {
        super()

        this.mouse = {
            pan: {
                x: 0,
                y: 0,
            },
            position: {
                centerRel: {
                    x: 0,
                    y: 0,
                },
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
