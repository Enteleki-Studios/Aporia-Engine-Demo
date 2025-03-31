import { LineBasicMaterial, AxesHelper as ThreeAxesHelper } from 'three'

export class AxesHelper extends ThreeAxesHelper {
    constructor(size = 1) {
        super(size)
        this.renderOrder = 999
        const mat = this.material as LineBasicMaterial
        mat.depthTest = false
    }
}
