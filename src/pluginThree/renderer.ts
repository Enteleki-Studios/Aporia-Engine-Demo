import {
    PCFSoftShadowMap,
    PerspectiveCamera,
    ReinhardToneMapping,
    Scene,
    WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export class Renderer {
    renderer
    canvas
    scene
    camera

    shouldRender = false

    constructor() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true,
        })

        this.renderer.toneMapping = ReinhardToneMapping
        this.renderer.toneMappingExposure = 2
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.setPixelRatio(1 /* window.devicePixelRatio */)
        this.renderer.debug.checkShaderErrors = true
        // this.renderer.autoClear = false
        // this.renderer.info.autoReset = false
        this.canvas = this.renderer.domElement

        this.scene = new Scene()
        this.camera = new PerspectiveCamera(60, 1, 0.1, 100)

        new OrbitControls(this.camera, this.canvas)
    }

    render() {
        if (this.shouldRender) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    setSize(width: number, height: number) {
        const aspect = width / height

        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height, false)
    }

    setCanvasContainer(element: HTMLElement | null) {
        if (element) {
            element.replaceChildren()
            element.appendChild(this.canvas)
            this.shouldRender = true
        } else {
            this.shouldRender = false
        }
    }
}
