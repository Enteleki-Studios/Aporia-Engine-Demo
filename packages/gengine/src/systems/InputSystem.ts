import type { World } from 'World'
import { createSystem } from '../ecs'
import type { InputManager } from '../managers/InputManager'
import { InputComponent } from 'components'
import { inputFilter } from 'filters'

export const inputSystem = createSystem<{ inputManager: InputManager }>(
    'input',
    ({ inputManager }) =>
        (world: World) => {
            const liveInput = inputManager.readInput()
            const { panX, panY, centerRelX, centerRelY } = inputManager.readMouse()
            inputManager.resetMouse()

            world.ecs.filterBy(inputFilter).forEach((entity) => {
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
        },
)
