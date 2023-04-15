import { AnimationClip, AnimationAction } from 'three'
import { Component } from 'gengine'

export class AnimationComponent extends Component {
    needsUpdate = true
    loaded = false
    isLoading = false
    prevState: string | null = null
    animations: Record<
        string,
        {
            clip: AnimationClip
            action: AnimationAction
        }
    > = {}

    state: string

    constructor(state: string) {
        super()
        this.state = state
    }
}
