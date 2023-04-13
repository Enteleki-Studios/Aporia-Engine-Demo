import { ECSFilter, System } from '../ecs'
import { InputManager } from '../managers/InputManager'
import { InputComponent } from '../components/InputComponent'

export class InputSystem implements System {
    inputFilter = new ECSFilter([InputComponent])

    filters = [this.inputFilter]

    inputManager: InputManager

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager
    }

    tick() {
        const liveInput = this.inputManager.readInput()
        const { panX, panY, centerRelX, centerRelY } = this.inputManager.readMouse()
        this.inputManager.resetMouse()

        this.inputFilter.entities.forEach((entity) => {
            const inputComponent = entity.get(InputComponent)
            Object.keys(liveInput).forEach((action) => {
                const actionInput = inputComponent.input[action]
                if (liveInput[action]) {
                    if (!actionInput.hold) {
                        if (actionInput.press) {
                            actionInput.press = false
                            actionInput.hold = true
                        } else {
                            actionInput.press = true
                        }
                    }
                } else {
                    actionInput.press = false
                    actionInput.hold = false
                }
                actionInput.press = liveInput[action]
            })

            inputComponent.mouse.pan.x = panX
            inputComponent.mouse.pan.y = panY

            inputComponent.mouse.position.centerRel.x = centerRelX
            inputComponent.mouse.position.centerRel.y = centerRelY
        })
    }
}
