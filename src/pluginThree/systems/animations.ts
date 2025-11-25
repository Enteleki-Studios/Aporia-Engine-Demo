import type { ThreeWorld } from "@pluginThree"
import { animationQuery } from "../queries"

export const animationSystem = (world: ThreeWorld) => {
    world.resources.entities
        .query(animationQuery)
        .forEach(([[animation], entity]) => {
            const { animationStore } = world.resources.three
            const store = animationStore.get(entity.id)

            if (store) {
                const { mixer, actions } = store
                const { actionName, prevActionName } = animation

                if (actionName && actionName !== prevActionName) {
                    const nextAction = actions[actionName] ?? null
                    const prevAction = prevActionName
                        ? (actions[prevActionName] ?? null)
                        : null

                    if (nextAction) {
                        nextAction.time = 0.0
                        nextAction.enabled = true
                        nextAction.setEffectiveTimeScale(1.0)
                        nextAction.setEffectiveWeight(1.0)

                        if (prevAction) {
                            const ratio =
                                nextAction.getClip().duration /
                                    prevAction.getClip().duration
                            nextAction.time = prevAction.time * ratio

                            // For eg death
                            // action.loop = LoopOnce
                            // action.clampWhenFinished = true

                            nextAction.crossFadeFrom(prevAction, 0.5, true)
                        }

                        nextAction.play()
                    }

                    animation.prevActionName = actionName
                }

                mixer.update(world.clock.delta)
            }
        })
}
