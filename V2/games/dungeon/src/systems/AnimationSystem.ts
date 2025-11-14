// import { Vec3 } from 'gl-matrix'
import { LoopOnce } from 'three'

import {
    ECSFilter,
    World,
    animationComponent,
    createSystem,
    healthComponent,
    inputComponent,
    modelComponent,
    velocityComponent,
} from '@gengine/core'
import { ThreejsPlugin } from '@gengine/plugin-threejs'

export const animatedFilter = new ECSFilter([animationComponent, modelComponent])

export const animationSystem = createSystem('animations', () => (world: World) => {
    const { animationManager } = world.getPlugin(ThreejsPlugin)

    for (const entity of world.ecs.filterBy(animatedFilter)) {
        const animation = entity.get(animationComponent)

        let nextState = 'idle'

        if (entity.has(inputComponent)) {
            const { input } = entity.get(inputComponent)
            if (input.up.hold || input.left.hold || input.right.hold || input.down.hold) {
                nextState = 'walk'
                if (input.run.hold) {
                    nextState = 'run'
                }
            }
        } else if (entity.has(velocityComponent)) {
            const { velocity } = entity.get(velocityComponent)

            // if (Vec3.squaredLength(velocity) > 0.1) {
            if (Math.abs(velocity[0]) > 0.01 && Math.abs(velocity[2]) > 0.01) {
                nextState = 'walk'
            }
        }

        if (entity.has(healthComponent)) {
            if (!entity.get(healthComponent).health) {
                nextState = 'death'
            }
        }

        // if (inputComponent.attacking) {
        //     nextState = 'attack'
        // }

        if (animation.state !== nextState) {
            animation.prevState = animation.state
            animation.state = nextState
        }
        // else if (animation.state !== animation.prevState) {
        //     animation.prevState = animation.state
        // }

        const animationsContainer = animationManager.getContainer(entity.id)

        if (animationsContainer) {
            if (animation.state !== animation.prevState) {
                const nextAnimation = animationManager.getResource(entity.id, nextState)

                if (nextAnimation) {
                    const { action } = nextAnimation
                    action.time = 0.0
                    action.enabled = true
                    action.setEffectiveTimeScale(1.0)
                    action.setEffectiveWeight(1.0)

                    if (animation.prevState) {
                        const prevAnimation = animationManager.getResource(
                            entity.id,
                            animation.prevState,
                        )
                        if (prevAnimation) {
                            const { action: prevAction } = prevAnimation
                            if (animation.state !== 'attack') {
                                const ratio =
                                    action.getClip().duration /
                                    prevAction.getClip().duration
                                action.time = prevAction.time * ratio
                            }
                            if (animation.state === 'death') {
                                action.loop = LoopOnce
                                action.clampWhenFinished = true
                            }
                            action.crossFadeFrom(prevAction, 0.5, true)
                        }
                    }

                    action.play()
                }

                // Only reset prevState if we've responded to it
                // TODO Properly implement triggering current animation on model load
                animation.prevState = animation.state
            }

            animationsContainer.mixer?.update(world.timeElapsedS)
        }
    }
})
