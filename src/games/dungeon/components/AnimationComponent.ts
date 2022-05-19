import { AnimationClip, AnimationAction } from 'three'
import { Component } from 'gengine'

export class AnimationComponent extends Component {
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

    constructor(entityId: string, state: string) {
        super(entityId)

        this.state = state
    }
}
