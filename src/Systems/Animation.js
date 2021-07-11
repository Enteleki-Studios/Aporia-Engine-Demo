import System from 'ECS/System'
import { ANIMATION, INPUT } from 'Components/types'

export class Animation extends System {
    tick() {
        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, INPUT]).forEach(
            ([animationComponent, inputComponent]) => {
                if (inputComponent.forward) {
                    let nextState = 'walk'
                    if (inputComponent.run) {
                        nextState = 'run'
                    }
                    if (animationComponent.state !== nextState) {
                        animationComponent.prevState = animationComponent.state
                        animationComponent.state = nextState
                        animationComponent.needsUpdate = true
                    }
                } else if (animationComponent.state !== 'idle') {
                    animationComponent.prevState = animationComponent.state
                    animationComponent.state = 'idle'
                    animationComponent.needsUpdate = true
                }
            },
        )
    }
}
