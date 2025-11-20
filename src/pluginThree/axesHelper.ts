import { AxesHelper as ThreeAxesHelper } from 'three'

export class AxesHelper extends ThreeAxesHelper {
    constructor(size = 1) {
        super(size)
        this.renderOrder = 999
        this.material.depthTest = false
    }
}
