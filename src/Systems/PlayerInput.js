import System from 'ECS/System'
import { HERO, INPUT } from 'Components/types'

export class PlayerInput extends System {
    constructor({ canvas }) {
        super()

        this._canvas = canvas

        this._liveInput = {
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

        this._canvas.addEventListener('click', () => {
            this._canvas.requestPointerLock()
        })

        const onMouseMove = (e) => this._onMouseMove(e)
        const onPointerLockChange = () => {
            if (document.pointerLockElement === this._canvas) {
                document.addEventListener('mousemove', onMouseMove, false)
            } else {
                document.removeEventListener('mousemove', onMouseMove, false)
            }
        }

        document.addEventListener('pointerlockchange', onPointerLockChange, false)
    }

    _onMouseMove(e) {
        this._liveInput.mouseX += e.movementX
        this._liveInput.mouseY += e.movementY
    }

    _onKeyDown(e) {
        e.preventDefault()

        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this._liveInput.up = true
                break
            case 'KeyS':
            case 'ArrowDown':
                this._liveInput.down = true
                break
            case 'KeyA':
            case 'ArrowLeft':
                this._liveInput.left = true
                break
            case 'KeyD':
            case 'ArrowRight':
                this._liveInput.right = true
                break
            case 'ShiftLeft':
                this._liveInput.shift = true
                break
            case 'Space':
                this._liveInput.space = true
                break
            default:
                break
        }
    }

    _onKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this._liveInput.up = false
                break
            case 'KeyS':
            case 'ArrowDown':
                this._liveInput.down = false
                break
            case 'KeyA':
            case 'ArrowLeft':
                this._liveInput.left = false
                break
            case 'KeyD':
            case 'ArrowRight':
                this._liveInput.right = false
                break
            case 'ShiftLeft':
                this._liveInput.shift = false
                break
            case 'Space':
                this._liveInput.space = false
                break
            default:
                break
        }
    }

    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([HERO, INPUT]).forEach(([, inputComponent]) => {
            if (this._liveInput.shift && !this._liveInput.down) {
                inputComponent.run = true
            } else {
                inputComponent.run = false
            }

            if (this._liveInput.up) {
                if (inputComponent.upHold) {
                    inputComponent.upPress = false
                } else {
                    inputComponent.upPress = true
                    inputComponent.upHold = true
                    inputComponent.forward = true
                }
            } else {
                inputComponent.upPress = false
                inputComponent.upHold = false
                inputComponent.forward = false
            }

            if (this._liveInput.left) {
                if (inputComponent.leftHold) {
                    inputComponent.leftPress = false
                } else {
                    inputComponent.leftPress = true
                    inputComponent.leftHold = true
                }
            } else {
                inputComponent.leftPress = false
                inputComponent.leftHold = false
            }

            if (this._liveInput.right) {
                if (inputComponent.rightHold) {
                    inputComponent.rightPress = false
                } else {
                    inputComponent.rightPress = true
                    inputComponent.rightHold = true
                }
            } else {
                inputComponent.rightPress = false
                inputComponent.rightHold = false
            }

            if (this._liveInput.down) {
                if (inputComponent.downHold) {
                    inputComponent.downPress = false
                } else {
                    inputComponent.downPress = true
                    inputComponent.downHold = true
                }
            } else {
                inputComponent.downPress = false
                inputComponent.downHold = false
            }

            if (this._liveInput.space) {
                inputComponent.attacking = true
            } else {
                inputComponent.attacking = false
            }

            inputComponent.pan.set(this._liveInput.mouseX, this._liveInput.mouseY, 0)
            this._liveInput.mouseX = 0
            this._liveInput.mouseY = 0
        })
    }
}
