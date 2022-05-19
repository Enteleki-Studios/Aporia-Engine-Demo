import { AnimationMixer } from 'three'
import { ModelComponent, InputComponent, ComponentManager } from 'gengine'
import { AnimationComponent } from 'components'

import modelDB from 'modelDB'

const _jobs: Array<(delta: number) => void> = []

async function loadAnimations(
    animationComponent: AnimationComponent,
    modelComponent: ModelComponent<typeof modelDB>,
) {
    const { resource: model } = modelComponent
    const { animations: animationIndex } = modelDB[modelComponent.modelName]

    if (!model) { // TODO can we remove this check?
        return null
    }

    const mixer = new AnimationMixer(model)

    // console.debug(model.animations)

    if (model.animations && animationIndex) {
        Object.entries(animationIndex).forEach(([key, name]) => {
            const animation = model.animations.find((a) => a.name === name)
            if (animation) {
                animationComponent.animations[key] = {
                    clip: animation,
                    action: mixer.clipAction(animation),
                }
            }
        })
    }

    return mixer
}

export function animationSystem(delta: number, componentManager: ComponentManager) {
    componentManager.getTuplesByClass(
        AnimationComponent,
        InputComponent,
    ).forEach(([animationComponent, inputComponent]) => {
        let nextState = 'idle'
        if (
            inputComponent.input.up.hold
        || inputComponent.input.left.hold
        || inputComponent.input.right.hold
        || inputComponent.input.down.hold
        ) {
            nextState = 'walk'
            if (inputComponent.input.run.hold) {
                nextState = 'run'
            }
        }

        // if (inputComponent.attacking) {
        //     nextState = 'attack'
        // }

        if (animationComponent.state !== nextState) {
            animationComponent.prevState = animationComponent.state
            animationComponent.state = nextState
            animationComponent.needsUpdate = true
        }
    })

    componentManager.getTuplesByClass(
        AnimationComponent,
        ModelComponent,
    ).forEach(([animationComponent, modelComponent]) => {
        if (
            !animationComponent.loaded
        && !animationComponent.isLoading
        // && this._dbLoaded
        && modelComponent.resource
        ) {
            animationComponent.isLoading = true
            loadAnimations(animationComponent, modelComponent).then((mixer) => {
                animationComponent.isLoading = false
                if (mixer) {
                    animationComponent.loaded = true
                    _jobs.push((d) => mixer.update(d))
                }
            })
        } else if (animationComponent.loaded && animationComponent.needsUpdate) {
            // Update animation
            const { animations } = animationComponent
            if (animations) {
                const { action } = animations[animationComponent.state]
                action.time = 0.0
                action.enabled = true
                action.setEffectiveTimeScale(1.0)
                action.setEffectiveWeight(1.0)
                if (animationComponent.prevState) {
                    const { action: prevAction } = animations[animationComponent.prevState]
                    if (animationComponent.state !== 'attack') {
                        const ratio = action.getClip().duration / prevAction.getClip().duration
                        action.time = prevAction.time * ratio
                    }
                    action.crossFadeFrom(prevAction, 0.5, true)
                }
                action.play()
                animationComponent.needsUpdate = false
            }
        }
    })

    _jobs.forEach((job) => job(delta))
}
