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
    private actionListeners: Record<Action, Callback[] | undefined> = {}
    private expandedKeymap: Record<KeyCode, Action[] | undefined> = {}
    private mouseInput: MouseInput
    private domElement: HTMLElement
    private pointerLockEnabled = false
    private hasPointerLock = false

    constructor({ domElement, keymap, pointerLock = false }: InputManagerSettings) {
        this.domElement = domElement

        this.mouseInput = {
            panX: 0,
            panY: 0,
            centerRelX: 0,
            centerRelY: 0,
        }

        this.initInputHandlers()
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
            this.mouseInput.centerRelX =
                ((e.clientX - offsetX) / this.domElement.clientWidth) * 2 - 1
            this.mouseInput.centerRelY =
                ((e.clientY - offsetY) / this.domElement.clientHeight) * -2 + 1
        }
    }

    resetMouse() {
        this.mouseInput.panX = 0
        this.mouseInput.panY = 0
        // this.mouseInput.centerRelX = 0
        // this.mouseInput.centerRelY = 0
    }

    disablePointerLock() {
        document.exitPointerLock()
    }
}
