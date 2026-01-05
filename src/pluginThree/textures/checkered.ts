import { DataTexture, NearestFilter, RGBAFormat, RepeatWrapping } from 'three'

const makeData = (c1: number, c2: number) =>
    // prettier-ignore
    new Uint8Array([
        c1, c1, c1, 255,
        c2, c2, c2, 255,
        c2, c2, c2, 255,
        c1, c1, c1, 255,
    ])

export class CheckeredTexture extends DataTexture {
    constructor() {
        super(makeData(80, 255), 2, 2, RGBAFormat)
        this.magFilter = NearestFilter
        this.minFilter = NearestFilter
        this.wrapS = RepeatWrapping
        this.wrapT = RepeatWrapping
        this.needsUpdate = true
    }
}
