import { AxesHelper as ThreeAxesHelper } from 'three'

import { forOneOrEach } from '@enteleki-studios/aporia-engine-core/utils'

export class AxesHelper extends ThreeAxesHelper {
    constructor(size = 1) {
        super(size)
        this.renderOrder = 999

        forOneOrEach(this.material, (mat) => {
            mat.depthTest = false
        })
    }
}
