import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader()
const textureLoader = new THREE.TextureLoader()

export default function loadFBX(modelPath: string, texturePath?: string): Promise<THREE.Object3D> {
    return new Promise((resolve) => {
        loader.load(modelPath, (model: THREE.Object3D) => {
            let texture: THREE.Texture | null = null

            if (texturePath) {
                texture = textureLoader.load(texturePath)
                texture.encoding = THREE.sRGBEncoding
                texture.flipY = true
            }

            model.traverse((c) => {
                if ('isMesh' in c && (c as THREE.Mesh).isMesh) {
                    c.castShadow = true
                    c.receiveShadow = true

                    if (texturePath) { // TODO: Fix the typings here, this is a hack
                        const b = c as THREE.Mesh
                        if (b.isMesh && b.material) {
                            if (!Array.isArray(b.material)) {
                                const bMat = b.material as THREE.MeshBasicMaterial
                                bMat.map = texture
                                bMat.side = THREE.DoubleSide
                            }
                        }
                    }
                }
            })

            resolve(model)
        })
    })
}
