import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export class DefaultCube extends Mesh {
    constructor() {
        const boxGeometry = new BoxGeometry(1, 1, 1)
        boxGeometry.translate(0, 0.5, 0)

        const boxMaterial = new MeshStandardMaterial({ color: 0xaaaaaa })

        super(boxGeometry, boxMaterial)

        this.receiveShadow = true
        this.castShadow = true
    }
}
