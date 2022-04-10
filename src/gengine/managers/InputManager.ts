import type { Keymap } from '../constants'

type Callback = () => void
type KeyCode = string
type Action = string
type MapsToAction = Action | Callback

export class InputManager {
    private actions: Record<Action, boolean>
    private expandedKeymap: Record<KeyCode, MapsToAction | MapsToAction[]>
    private mouseInput: { panX: number, panY: number }
    private domElement: HTMLElement

    constructor({ domElement, keymap }: { domElement: HTMLElement, keymap: Keymap }) {
        this.domElement = domElement

        this.expandedKeymap = {}
        this.actions = {}

        Object.keys(keymap).forEach((action) => {
            this.actions[action] = false
            const keyCodes = keymap[action]
            if (typeof keyCodes === 'string') {
                this.expandedKeymap[keyCodes] = action
            } else {
                keyCodes.forEach((keycode) => {
                    this.expandedKeymap[keycode] = action
                })
            }
        })

        this.mouseInput = {
            panX: 0,
            panY: 0,
        }

        this.initInputHandlers()
    }

    private initInputHandlers() {
        document.addEventListener('keydown', this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.onKeyUp.bind(this))

        this.domElement.addEventListener('click', () => {
            this.domElement.requestPointerLock()
        })

        const onMouseMove = (e: MouseEvent) => this.onMouseMove(e)
        const onPointerLockChange = () => {
            if (document.pointerLockElement === this.domElement) {
                document.addEventListener('mousemove', onMouseMove, false)
            } else {
                document.removeEventListener('mousemove', onMouseMove, false)
            }
        }

        document.addEventListener('pointerlockchange', onPointerLockChange, false)
    }

    private onMouseMove(e: MouseEvent) {
        this.mouseInput.panX += e.movementX
        this.mouseInput.panY += e.movementY
    }

    private onKeyDown(e: KeyboardEvent) {
        e.preventDefault()
        this.handleKey(e.code, true)
    }

    private onKeyUp(e: KeyboardEvent) {
        this.handleKey(e.code, false)
    }

    private handleKey(code: KeyCode, isPress: boolean) {
        const handlers = this.expandedKeymap[code]

        if (handlers) {
            if (typeof handlers === 'string') {
                this.actions[handlers] = isPress
            } else if (Array.isArray(handlers)) {
                handlers.forEach((handler) => {
                    if (typeof handler === 'string') {
                        this.actions[handler] = isPress
                    } else {
                        handler()
                    }
                })
            } else {
                handlers()
            }
        }
    }

    readInput() {
        return this.actions
    }

    readMouse() {
        return this.mouseInput
    }

    resetMouse() {
        this.mouseInput.panX = 0
        this.mouseInput.panY = 0
    }

    // addEventListener(action: Action, callback: Callback) {
    // }
}
