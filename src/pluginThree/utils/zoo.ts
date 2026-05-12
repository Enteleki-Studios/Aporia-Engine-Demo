import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { Transform3DComponent } from '@enteleki-studios/aporia-engine-core/components'

import { Animation, GltfComponent, RenderableDynamic } from '../components'

const gltfLoader = new GLTFLoader()

export const createAnimatedGltfExhibit = async (path: string) => {
    const gltf = await gltfLoader.loadAsync(path)
    const { animations } = gltf
    const width = Math.ceil(Math.sqrt(animations.length))
    const spacing = 3
    return animations.map((animation, index) => [
        Animation({ actionName: animation.name }),
        Transform3DComponent({
            position: [
                spacing * (index % width),
                0.9,
                spacing * -Math.floor(index / width),
            ],
        }),
        RenderableDynamic(),
        GltfComponent({
            path,
        }),
    ])
}
