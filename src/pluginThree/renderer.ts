import {
    ACESFilmicToneMapping,
    OrthographicCamera,
    PCFSoftShadowMap,
    PerspectiveCamera,
    // ReinhardToneMapping,
    SRGBColorSpace,
    Scene,
    WebGLRenderer,
} from 'three'

// import { OrbitControls } from 'three/examples/jsm/Addons.js'

export class Renderer {
    renderer
    canvas
    scene
    camera: PerspectiveCamera | OrthographicCamera | null = null
    width = 1920
    height = 1080

    shouldRender = false

    constructor() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: true,
        })

        this.renderer.toneMapping = ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1
        this.renderer.outputColorSpace = SRGBColorSpace

        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap

        this.renderer.debug.checkShaderErrors = true
        this.renderer.info.autoReset = false
        this.renderer.setPixelRatio(1)

        this.canvas = this.renderer.domElement

        this.scene = new Scene()

        this.setSize(this.width, this.height)
        // new OrbitControls(this.camera, this.canvas)
    }

    render() {
        if (this.shouldRender && this.camera) {
            this.renderer.info.reset()
            this.renderer.render(this.scene, this.camera)
        }
    }

    setSize(width: number, height: number) {
        this.width = width
        this.height = height

        this.renderer.setSize(width, height, false)

        this.updateCameraAspect()
    }

    setCanvasContainer(element: HTMLElement | null) {
        if (element) {
            element.replaceChildren(this.canvas)
            this.shouldRender = true
        } else {
            this.shouldRender = false
        }
    }

    setMainCamera(camera: PerspectiveCamera | OrthographicCamera) {
        this.camera = camera
        this.updateCameraAspect()
    }

    updateCameraAspect(aspect?: number) {
        if (this.camera && this.camera instanceof PerspectiveCamera) {
            const a = aspect ?? this.width / this.height
            this.camera.aspect = a
            this.camera.updateProjectionMatrix()
        }
    }
}
