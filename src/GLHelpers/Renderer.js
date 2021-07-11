import { WebGLRenderer, sRGBEncoding, PCFSoftShadowMap } from 'three'

export class Renderer extends WebGLRenderer {
    constructor({ canvas }) {
        super({
            antialias: true,
            canvas,
        })

        this.outputEncoding = sRGBEncoding
        this.shadowMap.enabled = true
        this.shadowMap.type = PCFSoftShadowMap
        this.setPixelRatio(window.devicePixelRatio)
    }
}
