import { System } from 'ECS'
import { AI, INPUT } from 'Components/types'

export class AIInput extends System {
    constructor() {
        super()

        this._timer = 0
    }

    static randInput() {
        return !Math.round(Math.random())
    }

    tick(delta) {
        this.ECS.ComponentManager.getTuplesByQuery([AI, INPUT]).forEach(([, inputComponent]) => {
            if (this._timer < 0) {
                inputComponent.upHold = AIInput.randInput()
                inputComponent.downHold = AIInput.randInput()
                inputComponent.leftHold = AIInput.randInput()
                inputComponent.rightHold = AIInput.randInput()
            }
        })
        if (this._timer < 0) {
            this._timer = Math.random() * 7
        } else {
            this._timer -= delta
        }
    }
}
