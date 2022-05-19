import { InputComponent } from '../components/InputComponent'
import type { ComponentManager } from '../managers/ComponentManager'
import { InputManager } from '../managers/InputManager'

export function inputSystem(componentManager: ComponentManager, inputManager: InputManager) {
    const liveInput = inputManager.readInput()
    const { panX, panY } = inputManager.readMouse()
    inputManager.resetMouse()

    componentManager.getTuplesByClass(InputComponent).forEach(([inputComponent]) => {
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
    })
}
