import { AnimationMixer } from 'three'
import { System, ModelComponent } from 'gengine'
import { ANIMATION, INPUT } from 'components/types'
import type {
    AnimationComponent,
    InputComponent,
} from 'components'

// import loadFBX from 'utils/loadFBX'
import modelDB from 'modelDB'
// import animationDB from 'animationDB'

export class Animation extends System {
    _jobs: Array<(delta: number) => void>
    // _dbAnimations: object
    // _dbLoaded: boolean

    constructor() {
        super()

        // this._dbAnimations = {}
        // this._dbLoaded = false

        this._jobs = []

        // this.loadDBAnimations()
    }

    // async loadDBAnimations() {
    //     await Promise.all(animationDB.map(async (animItem) => {
    //         const { name, modelPath: animationPath } = animItem
    //         const resource = await loadFBX(animationPath)
    //         const [animation] = resource.animations
    //         this._dbAnimations[name] = animation
    //     }))
    //     this._dbLoaded = true
    // }

    static async loadAnimations(
        animationComponent: AnimationComponent,
        modelComponent: ModelComponent<typeof modelDB>,
    ) {
        const { resource: model } = modelComponent
        const { animations: animationIndex } = modelDB[modelComponent.modelName]

        if (!model) { // TODO can we remove this check?
            return null
        }

        const mixer = new AnimationMixer(model)

        // if (animationsExternal) {
        //     animationsExternal.forEach((key) => {
        //         animationComponent.animations[key] = {
        //             clip: this._dbAnimations[key],
        //             action: mixer.clipAction(this._dbAnimations[key]),
        //         }
        //     })
        // }

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

    tick(delta: number) {
        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, INPUT]).forEach((tuple) => {
            const [animationComponent, inputComponent] = tuple as [AnimationComponent, InputComponent]
            let nextState = 'idle'
            if (inputComponent.downHold) {
                // nextState = 'walkBack'
                nextState = 'walk'
            } else if (inputComponent.upHold || inputComponent.leftHold || inputComponent.rightHold) {
                nextState = 'walk'
                if (inputComponent.run) {
                    nextState = 'run'
                }
            }

            if (inputComponent.attacking) {
                nextState = 'attack'
            }

            if (animationComponent.state !== nextState) {
                animationComponent.prevState = animationComponent.state
                animationComponent.state = nextState
                animationComponent.needsUpdate = true
            }
        })

        this.ECS.ComponentManager.getTuplesByQuery([ANIMATION, 'MODEL']).forEach((tuple) => {
            const [animationComponent, modelComponent] = tuple as [AnimationComponent, ModelComponent<typeof modelDB>]
            if (
                !animationComponent.loaded
            && !animationComponent.isLoading
            // && this._dbLoaded
            && modelComponent.resource
            ) {
                animationComponent.isLoading = true
                Animation.loadAnimations(animationComponent, modelComponent).then((mixer) => {
                    animationComponent.isLoading = false
                    if (mixer) {
                        animationComponent.loaded = true
                        this._jobs.push((d) => mixer.update(d))
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

        this._jobs.forEach((job) => job(delta))
    }
}
