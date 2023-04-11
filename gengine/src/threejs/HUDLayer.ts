import { Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Texture } from 'three'

export class HUDLayer {
    scene
    camera

    constructor(width: number, height:number, map: Texture) {
        this.scene = new Scene()
        this.camera = new OrthographicCamera(
            -width / 2,
            width / 2,
            height / 2,
            -height / 2,
            0,
            30,
        )

        const mat = new MeshBasicMaterial({ map })
        mat.transparent = true
        const geo = new PlaneGeometry(width, height)

        this.scene.add(new Mesh(geo, mat))
    }
}
