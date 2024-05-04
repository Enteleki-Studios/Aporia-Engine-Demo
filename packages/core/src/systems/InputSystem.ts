import { inputComponent } from 'components'
import { type World, createSystem } from 'core'
import { inputFilter } from 'filters'

import type { InputManager } from '../managers/InputManager'

export const inputSystem = createSystem<{ inputManager: InputManager }>(
    'input',
    ({ inputManager }) =>
        (world: World) => {
            const liveInput = inputManager.readInput()
            const { panX, panY, centerRelX, centerRelY } = inputManager.readMouse()
            inputManager.resetMouse()

            for (const entity of world.ecs.filterBy(inputFilter)) {
                const { input, mouse } = entity.get(inputComponent)
                Object.keys(liveInput).forEach((action) => {
                    const actionInput = input[action]
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

                mouse.pan.x = panX
                mouse.pan.y = panY

                mouse.position.centerRel.x = centerRelX
                mouse.position.centerRel.y = centerRelY
            }
        },
)
