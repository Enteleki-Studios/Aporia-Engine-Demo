import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export class DefaultCube extends Mesh {
    constructor()
    constructor(size: number, color?: number)
    constructor(x: number, y: number, z: number, color?: number)
    constructor(a?: number, b?: number, c?: number, d?: number) {
        let sizeX = 1
        let sizeY = 1
        let sizeZ = 1
        let color = 0xaaaaaa

        if (a && b && c) {
            // Rectangle
            sizeX = a
            sizeY = b
            sizeZ = c

            if (d) {
                color = d
            }
        } else if (a) {
            // Cube
            sizeX = a
            sizeY = a
            sizeZ = a

            if (b) {
                color = b
            }
        }

        const boxGeometry = new BoxGeometry(sizeX, sizeY, sizeZ)
        boxGeometry.translate(0, sizeY / 2, 0)

        const boxMaterial = new MeshStandardMaterial({ color })

        super(boxGeometry, boxMaterial)

        this.receiveShadow = true
        this.castShadow = true
    }
}
