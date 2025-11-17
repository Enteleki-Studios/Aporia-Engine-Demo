import { createComponent } from '@core'

export const GltfComponent = createComponent('gltf', ({ path }: { path: string }) => ({
    path,
}))
