import { InputComponent } from '../components/InputComponent'
import type { ComponentManager } from '../managers/ComponentManager'
import { InputManager } from '../managers/InputManager'

export const inputSystem = (componentManager: ComponentManager, inputManager: InputManager) => {
    const liveInput = inputManager.readInput()

    componentManager.getTuplesByQueryGeneric<[InputComponent]>(['input']).forEach(([inputComponent]) => {
        Object.keys(liveInput).forEach((action) => {
            const actionInput = inputComponent.input[action]
            if (actionInput) {
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
            } else { // TODO pre-populate in the component
                inputComponent.input[action] = {
                    press: true,
                    hold: false,
                }
            }
        })
    })
}
