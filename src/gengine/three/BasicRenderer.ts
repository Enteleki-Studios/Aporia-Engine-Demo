import { Color, PCFSoftShadowMap, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from 'three'

import { System } from '../ECS/System'

export class BasicRenderer extends System {
    camera
    renderer
    scene

    jobs: Array<(delta: number) => void>

    constructor({ canvas }: { canvas: HTMLCanvasElement }) {
        super()

        this.renderer = new WebGLRenderer({ canvas })

        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.scene = new Scene()
        this.scene.background = new Color(0x161616)

        const fov = 60
        const aspect = canvas.clientWidth / canvas.clientHeight
        const near = 0.5
        const far = 50
        this.camera = new PerspectiveCamera(fov, aspect, near, far)

        this.jobs = []
    }

    tick(delta: number) {
        this.renderer.render(this.scene, this.camera)

        this.jobs.forEach((job) => job(delta))
    }
}
