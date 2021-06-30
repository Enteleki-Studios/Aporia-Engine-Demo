// TODO: Might need to synchronize component updates to tick

import System from 'ECS/System'

export class Input extends System {
    constructor() {
        super([
            'singletonInput',
        ])

        this._inputComponent = null

        this._liveInput = {
            up: false,
            left: false,
            right: false,
            down: false,
        }

        this._initInputHandlers()
    }

    addComponent(component) {
        this._inputComponent = component
    }

    _initInputHandlers() {
        document.addEventListener('keydown', this._onKeyDown.bind(this))
        document.addEventListener('keyup', this._onKeyUp.bind(this))
    }

    _onKeyDown(e) {
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
            default:
                break
        }
    }

    tick() {
        if (!this._inputComponent) {
            return
        }

        if (this._liveInput.up) {
            if (this._inputComponent.upHold) {
                this._inputComponent.upPress = false
            } else {
                this._inputComponent.upPress = true
                this._inputComponent.upHold = true
            }
        } else {
            this._inputComponent.upPress = false
            this._inputComponent.upHold = false
        }

        if (this._liveInput.left) {
            if (this._inputComponent.leftHold) {
                this._inputComponent.leftPress = false
            } else {
                this._inputComponent.leftPress = true
                this._inputComponent.leftHold = true
            }
        } else {
            this._inputComponent.leftPress = false
            this._inputComponent.leftHold = false
        }

        if (this._liveInput.right) {
            if (this._inputComponent.rightHold) {
                this._inputComponent.rightPress = false
            } else {
                this._inputComponent.rightPress = true
                this._inputComponent.rightHold = true
            }
        } else {
            this._inputComponent.rightPress = false
            this._inputComponent.rightHold = false
        }

        if (this._liveInput.down) {
            if (this._inputComponent.downHold) {
                this._inputComponent.downPress = false
            } else {
                this._inputComponent.downPress = true
                this._inputComponent.downHold = true
            }
        } else {
            this._inputComponent.downPress = false
            this._inputComponent.downHold = false
        }
    }
}
