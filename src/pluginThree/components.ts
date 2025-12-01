import { createComponent } from '@core'

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
}

export const PerspectiveCamera = createComponent(
    'PerspectiveCamera',
    (state?: Partial<PerspectiveCamera>): PerspectiveCamera => ({
        fov: state?.fov ?? 55,
        aspect: state?.aspect ?? 1,
        near: state?.near ?? 0.1,
        far: state?.far ?? 2000,
    }),
)
