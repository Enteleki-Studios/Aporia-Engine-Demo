import {
    LinearFilter,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping,
    TextureLoader,
} from 'three'

const GRID_SEGMENTS = 4

export class DefaultTextureGrid extends Mesh {
    constructor(size = 128) {
        const floorTexture = new TextureLoader().load('/resources/textures/grid.jpg')
        floorTexture.wrapS = RepeatWrapping
        floorTexture.wrapT = RepeatWrapping
        floorTexture.minFilter = LinearFilter
        floorTexture.repeat.set(size / GRID_SEGMENTS, size / GRID_SEGMENTS)

        super(
            new PlaneGeometry(size, size),
            new MeshStandardMaterial({
                map: floorTexture,
            }),
        )

        this.receiveShadow = true

        this.rotation.x = -Math.PI / 2
    }
}
