interface InputMap {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    shift: boolean
    space: boolean
    mouseX: number
    mouseY: number
}

type KeyMap = Record<string, keyof InputMap>

const DEFAULT_KEYMAP: KeyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    KeyA: 'left',
    KeyW: 'up',
    KeyS: 'down',
    KeyD: 'right',
    ShiftLeft: 'shift',
    Space: 'space',
}

export class InputManager {
    liveInput: InputMap

    domElement: HTMLElement

    constructor({ domElement }: { domElement: HTMLElement }) {
        this.domElement = domElement

        this.liveInput = {
            up: false,
            left: false,
            right: false,
            down: false,
            shift: false,
            space: false,
            mouseX: 0,
            mouseY: 0,
        }

        this._initInputHandlers()
    }

    _initInputHandlers() {
        document.addEventListener('keydown', this._onKeyDown.bind(this))
        document.addEventListener('keyup', this._onKeyUp.bind(this))

        this.domElement.addEventListener('click', () => {
            this.domElement.requestPointerLock()
        })

        const onMouseMove = (e: MouseEvent) => this._onMouseMove(e)
        const onPointerLockChange = () => {
            if (document.pointerLockElement === this.domElement) {
                document.addEventListener('mousemove', onMouseMove, false)
            } else {
                document.removeEventListener('mousemove', onMouseMove, false)
            }
        }

        document.addEventListener('pointerlockchange', onPointerLockChange, false)
    }

    _onMouseMove(e: MouseEvent) {
        this.liveInput.mouseX += e.movementX
        this.liveInput.mouseY += e.movementY
    }

    _onKeyDown(e: KeyboardEvent) {
        e.preventDefault()

        if (DEFAULT_KEYMAP[e.code]) {
            this.liveInput[DEFAULT_KEYMAP[e.code]] = true
        }
    }

    _onKeyUp(e: KeyboardEvent) {
        if (DEFAULT_KEYMAP[e.code]) {
            this.liveInput[DEFAULT_KEYMAP[e.code]] = false
        }
    }

    // tick() {
    //     this.ECS.ComponentManager.getTuplesByQuery(['HERO', INPUT]).forEach((tuple) => {
    //         const [, inputComponent] = tuple as [HeroComponent, InputComponent]
    //         if (this.liveInput.shift && !this.liveInput.down) {
    //             inputComponent.run = true
    //         } else {
    //             inputComponent.run = false
    //         }

    //         if (this.liveInput.up) {
    //             if (inputComponent.upHold) {
    //                 inputComponent.upPress = false
    //             } else {
    //                 inputComponent.upPress = true
    //                 inputComponent.upHold = true
    //                 inputComponent.forward = true
    //             }
    //         } else {
    //             inputComponent.upPress = false
    //             inputComponent.upHold = false
    //             inputComponent.forward = false
    //         }

    //         if (this.liveInput.left) {
    //             if (inputComponent.leftHold) {
    //                 inputComponent.leftPress = false
    //             } else {
    //                 inputComponent.leftPress = true
    //                 inputComponent.leftHold = true
    //             }
    //         } else {
    //             inputComponent.leftPress = false
    //             inputComponent.leftHold = false
    //         }

    //         if (this.liveInput.right) {
    //             if (inputComponent.rightHold) {
    //                 inputComponent.rightPress = false
    //             } else {
    //                 inputComponent.rightPress = true
    //                 inputComponent.rightHold = true
    //             }
    //         } else {
    //             inputComponent.rightPress = false
    //             inputComponent.rightHold = false
    //         }

    //         if (this.liveInput.down) {
    //             if (inputComponent.downHold) {
    //                 inputComponent.downPress = false
    //             } else {
    //                 inputComponent.downPress = true
    //                 inputComponent.downHold = true
    //             }
    //         } else {
    //             inputComponent.downPress = false
    //             inputComponent.downHold = false
    //         }

    //         if (this.liveInput.space) {
    //             inputComponent.attacking = true
    //         } else {
    //             inputComponent.attacking = false
    //         }

    //         inputComponent.pan.set(this.liveInput.mouseX, this.liveInput.mouseY, 0)
    //         this.liveInput.mouseX = 0
    //         this.liveInput.mouseY = 0
    //     })
    // }
}
