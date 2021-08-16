import { AnimationMixer } from 'three'
import System from 'ECS/System'
import { ANIMATION, INPUT, MODEL } from 'Components/types'

import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'
import animationDB from 'animationDB'

export class Animation extends System {
    constructor() {
        super()

        this._animations = new Map()
        this._jobs = []
    }

    static async loadAnimations(animationComponent, modelComponent) {
        const model = modelComponent.resource
        const mixer = new AnimationMixer(model)

        await Promise.all(animationDB.map(async (animItem) => {
            const { name, modelPath: animationPath } = animItem
            const anim = await loadFBX(animationPath)
            animationComponent.animations[name] = ({
                clip: anim.animations[0],
                action: mixer.clipAction(anim.animations[0]),
            })
        }))

        const { animations: animationIndex } = modelDB[modelComponent.modelId]
        if (model.animations) {
            model.animations.forEach((anim) => {
                animationComponent.animations[animationIndex[anim.name]] = ({
                    clip: anim,
                    action: mixer.clipAction(anim),
                })
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
                    && modelComponent.resource
                ) {
                    animationComponent.isLoading = true
                    Animation.loadAnimations(animationComponent, modelComponent).then((mixer) => {
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

        this._jobs.forEach((j) => j(delta))
    }
}
