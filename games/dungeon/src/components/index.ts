import { createComponent } from 'gengine'

export const animationComponent = createComponent(
    'animationComponent',
    ({ state }: { state?: string }) => ({
        state: state ?? null,
        prevState: null as string | null,
    })
)

// import type { AnimationClip, AnimationAction, Vector3 } from 'three'

// export class AnimationComponent extends Component {
//     needsUpdate = true
//     loaded = false
//     isLoading = false
//     prevState: string | null = null
//     animations: Record<
//         string,
//         | undefined
//         | {
//               clip: AnimationClip
//               action: AnimationAction
//           }
//     > = {}

//     state: string

//     constructor(state: string) {
//         super()
//         this.state = state
//     }
// }

// export class CollidableComponent extends Component {
//     collisions: Vector3[] = []
// }
