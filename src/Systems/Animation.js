import { AnimationMixer } from 'three'
import System from 'ECS/System'
import { ANIMATION, INPUT, MODEL } from 'Components/types'

import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'
import animationDB from 'animationDB'

export class Animation extends System {
    constructor() {
        super()

        this._dbAnimations = {}
        this._dbLoaded = false

        this._jobs = []

        this.loadDBAnimations()
    }

    async loadDBAnimations() {
        await Promise.all(animationDB.map(async (animItem) => {
            const { name, modelPath: animationPath } = animItem
            const resource = await loadFBX(animationPath)
            const [animation] = resource.animations
            this._dbAnimations[name] = animation
        }))
        this._dbLoaded = true
    }

    async loadAnimations(animationComponent, modelComponent) {
        const { resource: model } = modelComponent
        const { animations: animationIndex, animationsExternal } = modelDB[modelComponent.modelId]

        const mixer = new AnimationMixer(model)

        if (animationsExternal) {
            animationsExternal.forEach((key) => {
                animationComponent.animations[key] = {
                    clip: this._dbAnimations[key],
                    action: mixer.clipAction(this._dbAnimations[key]),
                }
            })
        }

        if (animationIndex) {
            Object.entries(animationIndex).forEach(([key, name]) => {
                const animation = model.animations.find((a) => a.name === name)
                animationComponent.animations[key] = {
                    clip: animation,
                    action: mixer.clipAction(animation),
                }
            })
        }

        return mixer
    }

    tick(delta) {
        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, INPUT]).forEach(
            ([animationComponent, inputComponent]) => {
                let nextState = 'idle'
                if (inputComponent.downHold) {
                    nextState = 'walkBack'
                } else if (inputComponent.upHold || inputComponent.leftHold || inputComponent.rightHold) {
                    nextState = 'walk'
                    if (inputComponent.run) {
                        nextState = 'run'
                    }
                }

                if (animationComponent.state !== nextState) {
                    animationComponent.prevState = animationComponent.state
                    animationComponent.state = nextState
                    animationComponent.needsUpdate = true
                }
            },
        )

        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, MODEL]).forEach(
            ([animationComponent, modelComponent]) => {
                if (
                    !animationComponent.loaded
                    && !animationComponent.isLoading
                    && this._dbLoaded
                    && modelComponent.resource
                ) {
                    animationComponent.isLoading = true
                    this.loadAnimations(animationComponent, modelComponent).then((mixer) => {
                        animationComponent.loaded = true
                        animationComponent.isLoading = false
                        this._jobs.push((d) => mixer.update(d))
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
                            if (animationComponent.state !== 'idle') {
                                const ratio = action.getClip().duration / prevAction.getClip().duration
                                action.time = prevAction.time * ratio
                            }
                            action.crossFadeFrom(prevAction, 0.5, true)
                        }
                        action.play()
                        animationComponent.needsUpdate = false
                    }
                }
            },
        )

        this._jobs.forEach((job) => job(delta))
    }
}
