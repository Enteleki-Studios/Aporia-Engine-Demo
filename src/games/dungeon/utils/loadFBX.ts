import { Object3D, Texture, Mesh, sRGBEncoding, TextureLoader, MeshBasicMaterial, DoubleSide } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader()
const textureLoader = new TextureLoader()

export default function loadFBX(modelPath: string, texturePath?: string): Promise<Object3D> {
    return new Promise((resolve) => {
        loader.load(modelPath, (model: Object3D) => {
            let texture: Texture | null = null

            if (texturePath) {
                texture = textureLoader.load(texturePath)
                texture.encoding = sRGBEncoding
                texture.flipY = true
            }

            model.traverse((c) => {
                if ('isMesh' in c && (c as Mesh).isMesh) {
                    c.castShadow = true
                    c.receiveShadow = true

                    if (texturePath) { // TODO: Fix the typings here, this is a hack
                        const b = c as Mesh
                        if (b.isMesh && b.material) {
                            if (!Array.isArray(b.material)) {
                                const bMat = b.material as MeshBasicMaterial
                                bMat.map = texture
                                bMat.side = DoubleSide
                            }
                        }
                    }
                }
            })

            resolve(model)
        })
    })
}
