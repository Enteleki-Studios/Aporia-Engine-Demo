import { CameraHelper, DirectionalLightHelper, DirectionalLight as ThreeDL } from 'three'

export class DirectionalLight extends ThreeDL {
    helper: DirectionalLightHelper
    shadowHelper: CameraHelper

    constructor(color: number, intensity: number) {
        super(color, intensity)

        const d = 20

        this.castShadow = true

        this.shadow.bias = -0.0001
        this.shadow.mapSize.width = 2048
        this.shadow.mapSize.height = 2048
        this.shadow.camera.near = 0.5
        this.shadow.camera.far = 500
        this.shadow.camera.left = d
        this.shadow.camera.right = -d
        this.shadow.camera.top = d
        this.shadow.camera.bottom = -d

        this.helper = new DirectionalLightHelper(this, 1)
        this.shadowHelper = new CameraHelper(this.shadow.camera)
    }
}
