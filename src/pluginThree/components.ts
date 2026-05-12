import { Array3, createComponent } from '@enteleki-studios/aporia-engine-core'

export const RenderableDynamic = createComponent('RenderableDynamic')
export const RenderableFixed = createComponent('RenderableFixed')

export const GltfComponent = createComponent('gltf', ({ path }: { path: string }) => ({
    path,
}))

type Animation = {
    actionName: string | null
    prevActionName: string | null
}

export const Animation = createComponent(
    'Animation',
    (state: Partial<Animation>): Animation => ({
        actionName: state.actionName ?? null,
        prevActionName: state.prevActionName ?? null,
    }),
)

type PerspectiveCamera = {
    fov: number
    aspect: number
    near: number
    far: number

    // TODO: Should yaw+pitch be tracked elsewhere?
    yaw: number
    pitch: number
}

export const PerspectiveCamera = createComponent(
    'PerspectiveCamera',
    (state?: Partial<PerspectiveCamera>): PerspectiveCamera => ({
        fov: state?.fov ?? 55,
        aspect: state?.aspect ?? 1,
        near: state?.near ?? 0.1,
        far: state?.far ?? 2000,
        yaw: state?.yaw ?? 0,
        pitch: state?.pitch ?? 0,
    }),
)

type FloatingLabel = {
    text: string
    offset: Array3
    color: string | number
    size: number
    depth: number
}

export const FloatingLabel = createComponent(
    'FloatingLabel',
    (props: Partial<FloatingLabel>): FloatingLabel => ({
        text: props.text ?? 'Label',
        offset: props.offset ?? [0, 0, 0],
        color: props.color ?? 0xffffff,
        size: props.size ?? 0.3,
        depth: props.depth ?? (props.size ?? 0.5) / 5,
    }),
)
