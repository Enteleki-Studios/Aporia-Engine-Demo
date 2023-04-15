import type { Keymap } from '../constants'

type Callback = () => void
type KeyCode = string
type Action = string

type InputManagerSettings = {
    domElement: HTMLElement
    keymap: Keymap
    pointerLock?: boolean
}

type MouseInput = {
    /** Vertical distance moved since last read. Pointer must be locked. */
    panX: number

    /** Horizontal distance moved since last read. Pointer must be locked. */
    panY: number

    /**
     * Vertical axis mouse position as signed percentage from center to edge (-1 to +1).
     * Pointer must be unlocked.
     */
    centerRelX: number

    /**
     * Horizontal axis mouse position as signed percentage from center to edge (-1 to +1).
     * Pointer must be unlocked.
     */
    centerRelY: number
}

export class InputManager {
    private actions: Record<Action, boolean> = {}
    private actionListeners: Record<Action, Callback[]> = {}
    private expandedKeymap: Record<KeyCode, Action[]> = {}
    private mouseInput: MouseInput
    private domElement: HTMLElement
    private pointerLockEnabled = false
    private hasPointerLock = false

    constructor({ domElement, keymap, pointerLock = false }: InputManagerSettings) {
        this.domElement = domElement

        if (pointerLock) {
            this.allowPointerLock()
        }

        Object.keys(keymap).forEach((action) => {
            this.actions[action] = false
            const keyCodes = keymap[action]
            if (typeof keyCodes === 'string') {
                this.registerAction(keyCodes, action)
            } else {
                keyCodes.forEach((keyCode) => {
                    this.registerAction(keyCode, action)
                })
            }
        })

        this.mouseInput = {
            panX: 0,
            panY: 0,
            centerRelX: 0,
            centerRelY: 0,
        }

        this.initInputHandlers()
    }

    private registerAction(keyCode: KeyCode, action: Action) {
        if (this.expandedKeymap[keyCode]) {
            const currentActions = this.expandedKeymap[keyCode]
            if (Array.isArray(currentActions)) {
                currentActions.push(action)
            } else {
                this.expandedKeymap[keyCode] = [currentActions, action]
            }
        } else {
            this.expandedKeymap[keyCode] = [action]
        }
    }

    private initInputHandlers() {
        document.addEventListener('keydown', this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.onKeyUp.bind(this))

        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false)

        this.domElement.addEventListener('click', () => {
            if (this.pointerLockEnabled) {
                this.domElement.requestPointerLock()
            }
        })

        const onPointerLockChange = () => {
            if (document.pointerLockElement === this.domElement) {
                this.hasPointerLock = true
            } else {
                this.hasPointerLock = false
                this.resetMouse()
            }
        }

        document.addEventListener('pointerlockchange', onPointerLockChange, false)
    }

    private onMouseMove(e: MouseEvent) {
        if (this.hasPointerLock) {
            this.mouseInput.panX += e.movementX
            this.mouseInput.panY += e.movementY
        } else {
            const offsetX = this.domElement.offsetLeft
            const offsetY = this.domElement.offsetTop
            this.mouseInput.centerRelX = ((e.clientX - offsetX) / this.domElement.clientWidth) * 2 - 1
            this.mouseInput.centerRelY = ((e.clientY - offsetY) / this.domElement.clientHeight) * -2 + 1
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        e.preventDefault()
        this.handleKey(e.code, true)
    }

    private onKeyUp(e: KeyboardEvent) {
        this.handleKey(e.code, false)
    }

    private handleKey(code: KeyCode, isPress: boolean) {
        const actions = this.expandedKeymap[code]
        if (actions) {
            actions.forEach((action) => {
                this.actions[action] = isPress

                if (isPress) {
                    const callbacks = this.actionListeners[action]
                    if (callbacks && callbacks.length) {
                        callbacks.forEach((c) => {
                            c()
                        })
                    }
                }
            })
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
        // this.mouseInput.centerRelX = 0
        // this.mouseInput.centerRelY = 0
    }

    allowPointerLock() {
        this.pointerLockEnabled = true
    }

    disablePointerLock() {
        this.pointerLockEnabled = false
        document.exitPointerLock()
    }

    addActionListener(action: Action, callback: Callback) {
        const currentCallbacks = this.actionListeners[action]
        if (currentCallbacks) {
            currentCallbacks.push(callback)
        } else {
            this.actionListeners[action] = [callback]
        }
    }

    removeActionListener(action: Action, callback?: Callback) {
        const currentCallbacks = this.actionListeners[action]
        if (currentCallbacks && currentCallbacks.length) {
            if (callback) {
                for (let i = currentCallbacks.length - 1; i >= 0; i -= 1) {
                    if (currentCallbacks[i] === callback) {
                        currentCallbacks.splice(i, 1)
                    }
                }
            } else {
                this.actionListeners[action] = []
            }
        }
    }
}
