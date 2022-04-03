export class InputManager {
    private actions: Record<string, boolean>
    private mouseInput: Record<string, number>
    private expandedKeymap: Record<string, string>
    private domElement: HTMLElement

    constructor({ domElement, keymap }: { domElement: HTMLElement, keymap: Record<string, string> }) {
        this.domElement = domElement

        this.expandedKeymap = {}
        this.actions = {}

        Object.keys(keymap).forEach((action) => {
            this.actions[action] = false
            this.expandedKeymap[keymap[action]] = action
            // TODO allow for many-to-many action <-> keycode
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

        // this.domElement.addEventListener('click', () => {
        //     this.domElement.requestPointerLock()
        // })

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

        if (this.expandedKeymap[e.code]) {
            this.actions[this.expandedKeymap[e.code]] = true
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        if (this.expandedKeymap[e.code]) {
            this.actions[this.expandedKeymap[e.code]] = false
        }
    }

    readInput() {
        return this.actions
    }
}
