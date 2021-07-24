import System from 'ECS/System'
import { ANIMATION, INPUT } from 'Components/types'

export class Animation extends System {
    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, INPUT]).forEach(
            ([animationComponent, inputComponent]) => {
                let nextState = 'idle'
                if (inputComponent.upHold) {
                    nextState = 'walk'
                    if (inputComponent.run) {
                        nextState = 'run'
                    }
                } else if (inputComponent.downHold) {
                    nextState = 'walkBack'
                } else if (inputComponent.leftHold) {
                    nextState = 'strafeLeft'
                    if (inputComponent.run) {
                        nextState = 'strafeLeftRun'
                    }
                } else if (inputComponent.rightHold) {
                    nextState = 'strafeRight'
                    if (inputComponent.run) {
                        nextState = 'strafeRightRun'
                    }
                }

                if (animationComponent.state !== nextState) {
                    animationComponent.prevState = animationComponent.state
                    animationComponent.state = nextState
                    animationComponent.needsUpdate = true
                }
            },
        )
    }
}
