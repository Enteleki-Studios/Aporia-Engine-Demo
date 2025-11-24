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
