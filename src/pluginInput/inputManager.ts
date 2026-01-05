import type { Simplify } from 'type-fest'

import { mapObject } from '@core/utils'

import type { Keymap } from '.'

// TODO:
// Test if we need to handle window focus lost

export class InputManager<K extends Record<string, string>> {
    private element: HTMLElement | null = null
    private codeToAction: Record<string, keyof K>

    private pointerLockEnabled = true
    private hasPointerLock = false

    private liveInput = {
        mouse: {
            panX: 0,
            panY: 0,
        },
    }

    actions: Simplify<Record<keyof K, boolean>>

    // TODO: TEMP exposure of mouse data
    mouse = {
        panX: 0,
        panY: 0,
    }

    constructor(keymap: K) {
        this.actions = mapObject(keymap, () => false)
        this.codeToAction = Object.entries(keymap).reduce<Record<string, keyof Keymap>>(
            (acc, [action, code]) => {
                acc[code] = action
                return acc
            },
            {},
        )

        document.addEventListener('pointerlockchange', this.handlePointerLockChange)
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

    private handleMouseMove = (e: MouseEvent) => {
        if (this.hasPointerLock) {
            this.liveInput.mouse.panX += e.movementX
            this.liveInput.mouse.panY += e.movementY
        }
        // else {
        //     const offsetX = this.domElement.offsetLeft
        //     const offsetY = this.domElement.offsetTop
        //     this.mouseInput.centerRelX =
        //         ((e.clientX - offsetX) / this.domElement.clientWidth) * 2 - 1
        //     this.mouseInput.centerRelY =
        //         ((e.clientY - offsetY) / this.domElement.clientHeight) * -2 + 1
        // }
    }

    private handlePointerLockChange = () => {
        if (this.element && document.pointerLockElement === this.element) {
            this.hasPointerLock = true
        } else {
            this.hasPointerLock = false
            // this.resetMouse()
        }
    }

    private handleClick = () => {
        if (this.pointerLockEnabled) {
            void this.element?.requestPointerLock({ unadjustedMovement: true })
        }
    }

    private handleFocusLost = () => {
        for (const action in this.actions) {
            this.actions[action] = false
        }
    }

    setInputElement(element: HTMLElement | null) {
        if (element !== this.element) {
            if (this.element) {
                this.element.removeEventListener('blur', this.handleFocusLost)
                this.element.removeEventListener('click', this.handleClick)
                this.element.removeEventListener('keydown', this.handleKeyDown)
                this.element.removeEventListener('keyup', this.handleKeyUp)
                this.element.removeEventListener('mousemove', this.handleMouseMove)
            }

            if (element) {
                element.addEventListener('blur', this.handleFocusLost)
                element.addEventListener('click', this.handleClick)
                element.addEventListener('keydown', this.handleKeyDown)
                element.addEventListener('keyup', this.handleKeyUp)
                element.addEventListener('mousemove', this.handleMouseMove)
            }

            this.element = element
        }
    }

    flushInputs() {
        this.mouse.panX = this.liveInput.mouse.panX
        this.mouse.panY = this.liveInput.mouse.panY

        this.liveInput.mouse.panX = 0
        this.liveInput.mouse.panY = 0

        // TODO
    }

    disablePointerLock() {
        this.pointerLockEnabled = false
        document.exitPointerLock()
    }

    dispose() {
        this.setInputElement(null)

        document.exitPointerLock()
        document.removeEventListener('pointerlockchange', this.handlePointerLockChange)
    }
}
