import System from 'ECS/System'

export class Animation extends System {
    constructor() {
        super([
            'animation',
            'singletonInput',
        ])

        this._input = null
    }

    addComponent(component) {
        switch (component.type) {
            case 'singletonInput':
                this._input = component
                break
            case 'animation':
                this._saveComponent(component)
                break
            default:
                break
        }
    }

    tick() {
        this._components.forEach((animationComponent) => {
            if (this._input.forward) {
                let nextState = 'walk'
                if (this._input.run) {
                    nextState = 'run'
                }
                if (animationComponent.state !== nextState) {
                    animationComponent._prevState = animationComponent.state
                    animationComponent.state = nextState
                    animationComponent._needsUpdate = true
                }
            } else if (animationComponent.state !== 'idle') {
                animationComponent._prevState = animationComponent.state
                animationComponent.state = 'idle'
                animationComponent._needsUpdate = true
            }
        })
    }
}
