import { AnimationMixer } from 'three'
import { ModelComponent, InputComponent, System, ECSFilter, World } from 'gengine'
import { AnimationComponent } from 'components'

import modelDB from 'modelDB'

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

export class AnimationSystem extends System {
    private jobs: Array<(delta: number) => void> = []

    private updatingEntities = new ECSFilter([AnimationComponent, InputComponent])
    private loadingEntities = new ECSFilter([AnimationComponent, ModelComponent])

    filters = [this.updatingEntities, this.loadingEntities]

    tick(world: World) {
        this.updatingEntities.entities.forEach((entity) => {
            const animationComponent = entity.get(AnimationComponent)
            const inputComponent = entity.get(InputComponent)

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

        this.loadingEntities.entities.forEach((entity) => {
            const animationComponent = entity.get(AnimationComponent)
            const modelComponent = entity.get(ModelComponent)

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
                        this.jobs.push((d) => mixer.update(d))
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

        this.jobs.forEach((job) => job(world.timeElapsedS))
    }
}
