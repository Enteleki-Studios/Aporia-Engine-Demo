import { createComponent } from '@core'

export const RenderableDynamic = createComponent('RenderableDynamic')
export const RenderableFixed = createComponent('RenderableFixed')

export const GltfComponent = createComponent('gltf', ({ path }: { path: string }) => ({
    path,
}))

export const Animation = createComponent('Animation', ({ id }: { id: string }) => ({
    id,
}))
