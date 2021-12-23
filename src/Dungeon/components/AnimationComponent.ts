import { AnimationClip, AnimationAction } from 'three'
import { Component } from 'ECS'
import { ANIMATION } from './types'

export class AnimationComponent extends Component {
    type = ANIMATION

    needsUpdate = true
    loaded = false
    isLoading = false
    prevState: (string | null) = null
    animations: {
        [key: string]: {
            clip: AnimationClip,
            action: AnimationAction,
        },
    } = {}

    state: string

    constructor(entityId: number, state: string) {
        super(entityId)

        this.state = state
    }
}
