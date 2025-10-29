import { Group, Texture, TextureLoader } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import { isThreeMesh } from './utils'

// TODO don't create stuff in this scope
const loader = new FBXLoader()
const textureLoader = new TextureLoader()

type LoadFBXConfig = {
    castShadow?: boolean
}

export function loadFBX(modelPath: string, texturePath?: string, config?: LoadFBXConfig): Promise<Group> {
    return new Promise((resolve) => {
        loader.load(modelPath, (model: Group) => {
            let texture: Texture | null = null

            if (texturePath) {
                texture = textureLoader.load(texturePath)
                texture.flipY = true
            }

            model.traverse((c) => {
                if (isThreeMesh(c)) {
                    c.castShadow = config?.castShadow ?? false
                    c.receiveShadow = true

                    if (texturePath && 'material' in c && !Array.isArray(c.material) && 'map' in c.material) {
                        c.material.map = texture
                    }
                }
            })

            resolve(model)
        })
    })
}
