import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const loader = new FBXLoader()
const textureLoader = new THREE.TextureLoader()

export default function loadFBX(modelPath, texturePath) {
    return new Promise((resolve) => {
        loader.load(modelPath, (model) => {
            if (texturePath) {
                const texture = textureLoader.load(texturePath)
                texture.encoding = THREE.sRGBEncoding
                texture.flipY = true

                model.traverse((c) => {
                    if (c.isMesh) {
                        c.castShadow = true
                        c.receiveShadow = true
                        if (c.material) {
                            c.material.map = texture
                            c.material.side = THREE.DoubleSide
                            // c.material.wireframe = true
                        }
                    }
                })
            }
            resolve(model)
        })
    })
}
