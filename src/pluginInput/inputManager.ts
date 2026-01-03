import type { Simplify } from 'type-fest'

import { mapObject } from '@core/utils'

import type { Keymap } from '.'

// TODO:
// Reset on focus lost
// requestPointerLock({ unadjustedMovement: true, })

export class InputManager<K extends Record<string, string>> {
    private element: HTMLElement | null = null
    private codeToAction: Record<string, keyof K>

    actions: Simplify<Record<keyof K, boolean>>

    constructor(keymap: K) {
        this.actions = mapObject(keymap, () => false)
        this.codeToAction = Object.entries(keymap).reduce<Record<string, keyof Keymap>>(
            (acc, [action, code]) => {
                acc[code] = action
                return acc
            },
            {},
        )
    }

    private handleKey(e: KeyboardEvent, isPress: boolean) {
        const action = this.codeToAction[e.code]

        if (action) {
            this.actions[action] = isPress
        }
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        this.handleKey(e, true)
    }

    private handleKeyUp = (e: KeyboardEvent) => {
        this.handleKey(e, false)
    }

    setInputElement(element: HTMLElement | null) {
        console.debug(element)
        if (element !== this.element) {
            this.element?.removeEventListener('keydown', this.handleKeyDown)
            this.element?.removeEventListener('keyup', this.handleKeyUp)

            if (element) {
                element.addEventListener('keydown', this.handleKeyDown)
                element.addEventListener('keyup', this.handleKeyUp)
            }

            this.element = element
        }
    }

    flushInputs() {
        // TODO
    }
}
