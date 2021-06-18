import * as THREE from 'three'

export class DirectionalLight extends THREE.DirectionalLight {
    constructor(color, intensity) {
        super(color, intensity)

        const d = 10

        this.position.set(10, 15, 5)
        this.target.position.set(0, 0, 0)
        this.castShadow = true
        this.shadow.bias = -0.001
        this.shadow.mapSize.width = 2048
        this.shadow.mapSize.height = 2048
        this.shadow.camera.near = 0.5
        this.shadow.camera.far = 500
        this.shadow.camera.left = d
        this.shadow.camera.right = -d
        this.shadow.camera.top = d
        this.shadow.camera.bottom = -d

        this.helper = new THREE.DirectionalLightHelper(this, 1)
        this.shadowHelper = new THREE.CameraHelper(this.shadow.camera)
    }
}

export default DirectionalLight
