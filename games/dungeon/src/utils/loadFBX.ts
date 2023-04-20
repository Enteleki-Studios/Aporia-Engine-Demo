import { isThreeMesh } from 'gengine'
import { Texture, sRGBEncoding, TextureLoader, MeshBasicMaterial, DoubleSide, Group } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader()
const textureLoader = new TextureLoader()

export default function loadFBX(modelPath: string, texturePath?: string): Promise<Group> {
    return new Promise((resolve) => {
        loader.load(modelPath, (model: Group) => {
            let texture: Texture | null = null

            if (texturePath) {
                texture = textureLoader.load(texturePath)
                texture.encoding = sRGBEncoding
                texture.flipY = true
            }

            model.traverse((c) => {
                if (isThreeMesh(c)) {
                    c.castShadow = true
                    c.receiveShadow = true

                    if (texturePath) {
                        if (c.material instanceof MeshBasicMaterial) {
                            c.material.map = texture
                            c.material.side = DoubleSide
                        }
                    }
                }
            })

            resolve(model)
        })
    })
}
