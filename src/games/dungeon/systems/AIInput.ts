import { System } from 'gengine'
import { AI, INPUT } from 'components/types'
import type { AIComponent, InputComponent } from 'components'

export class AIInput extends System {
    _timer: number

    constructor() {
        super()

        this._timer = 0
    }

    static randInput() {
        return !Math.round(Math.random())
    }

    tick(delta: number) {
        if (this._timer < 0) {
            this.ECS.ComponentManager.getTuplesByQuery([AI, INPUT]).forEach((tuple) => {
                const [, inputComponent] = tuple as [AIComponent, InputComponent]

                inputComponent.upHold = AIInput.randInput()
                inputComponent.downHold = AIInput.randInput()
                inputComponent.leftHold = AIInput.randInput()
                inputComponent.rightHold = AIInput.randInput()
            })

            this._timer = Math.random() * 7
        } else {
            this._timer -= delta
        }
    }
}
