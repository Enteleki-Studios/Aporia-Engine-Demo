export class InputManager {
    private liveInput: Record<string, boolean>
    private mouseInput: Record<string, number>
    private keymap: Record<string, string>
    private domElement: HTMLElement

    constructor({ domElement, keymap }: { domElement: HTMLElement, keymap: Record<string, string> }) {
        this.domElement = domElement
        this.keymap = keymap

        this.liveInput = {}
        Object.values(keymap).forEach((input) => {
            this.liveInput[input] = false
        })

        this.mouseInput = {
            mouseX: 0,
            mouseY: 0,
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
        this.mouseInput.mouseX += e.movementX
        this.mouseInput.mouseY += e.movementY
    }

    private onKeyDown(e: KeyboardEvent) {
        e.preventDefault()

        if (this.keymap[e.code]) {
            this.liveInput[this.keymap[e.code]] = true
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        if (this.keymap[e.code]) {
            this.liveInput[this.keymap[e.code]] = false
        }
    }

    readInput() {
        return this.liveInput
    }
}
