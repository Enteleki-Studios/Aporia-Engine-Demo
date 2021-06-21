import * as THREE from 'three'

export class DirectionalLight extends THREE.DirectionalLight {
    constructor(color, intensity) {
        super(color, intensity)

        const d = 15

        this.position.set(10, 15, 5)
        this.target.position.set(0, 0, 0)
        this.castShadow = true
        // this.shadow.bias = -0.001
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

// const hemGiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
// hemiLight.position.set(0, 5, 0)
// this._scene.add(hemiLight)
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 1)
// this._scene.add(hemiLightHelper)

// const spotLight = new THREE.SpotLight(0xffffff, 1, 15, Math.PI / 4, 1)
// spotLight.position.set(2, 5, -2)
// spotLight.castShadow = true
// spotLight.shadow.mapSize.width = 2048
// spotLight.shadow.mapSize.height = 2048
// spotLight.shadow.camera.near = 5
// spotLight.shadow.camera.far = 400
// spotLight.shadow.camera.fov = 10
// const d = 10
// spotLight.shadow.camera.left = d
// spotLight.shadow.camera.right = -d
// spotLight.shadow.camera.top = d
// spotLight.shadow.camera.bottom = -d
// this._scene.add(spotLight)
// // this._scene.add(spotLight.target)
// const spotLightTarget = new THREE.Object3D()
// spotLight.target = spotLightTarget
// // this._scene.add(spotLight.target)
// // spotLightTarget.position.set(2, 0, 2)
// // spotLight.target.position.set(2, 0, 2)
// spotLight.target.position.x = 5
// this._scene.add(new THREE.SpotLightHelper(spotLight, 0x0000ff))

export default DirectionalLight
