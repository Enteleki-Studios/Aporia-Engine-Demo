import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    Color,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer,
    Object3D,
    CameraHelper,
    Vector4,
} from 'three'
import { AxesHelper } from './AxesHelper'
import { DebugInfoTexture } from './DebugInfoTexture'
import { HUDLayer } from './HUDLayer'

export class StandardRenderer {
    camera
    debugCamera
    renderer
    scene
    width = 0
    height = 0
    aspect = 1
    viewport = new Vector4()

    debugHelpers: Object3D[] = []
    debug = false
    debugMode: 'game' | 'debug' | 'sideBySide' = 'game'
    debugOrbitControls: OrbitControls
    showDebugOverlay = false
    debugOverlay: HUDLayer
    debugOverlayTexture: DebugInfoTexture
    debugViewport = new Vector4()

    jobs: Array<(delta: number) => void>

    constructor({
        canvas,
        fov = 60,
        aspect = 1,
        near = 0.5,
        far = 500,
    }: {
        canvas: HTMLCanvasElement
        fov?: number
        aspect?: number
        near?: number
        far?: number
    }) {
        this.jobs = []

        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true,
        })
        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.debug.checkShaderErrors = true
        this.renderer.autoClear = false
        this.renderer.setScissorTest(true)

        this.scene = new Scene()
        this.scene.background = new Color(0x161616)

        this.camera = new PerspectiveCamera(fov, aspect, near, far)
        this.camera.position.set(10, 10, 10)

        this.debugCamera = new PerspectiveCamera(fov, aspect, near, far)
        this.debugCamera.position.set(20, 20, 20)

        this.debugOrbitControls = new OrbitControls(this.debugCamera, this.renderer.domElement)

        this.setSize(1280, 720)

        this.addHelpers(
            new AxesHelper(),
            new CameraHelper(this.camera),
        )

        this.debugOverlayTexture = new DebugInfoTexture(canvas.width, canvas.height)
        this.debugOverlay = new HUDLayer(canvas.width, canvas.height, this.debugOverlayTexture)

        this.updateViewports()
    }

    render(delta: number) {
        if (this.debugMode !== 'debug') {
            this.renderer.setViewport(this.viewport)
            this.renderer.setScissor(this.viewport)
            this.renderer.render(this.scene, this.camera)
        }

        this.jobs.forEach((job) => job(delta))

        if (this.showDebugOverlay && this.debugMode !== 'debug') {
            this.debugOverlayTexture.update({ delta, renderer: this.renderer })
            this.renderer.render(this.debugOverlay.scene, this.debugOverlay.camera)
        }

        if (this.debug) {
            this.debugHelpers.forEach((h) => {
                h.visible = true
            })
            this.renderer.setViewport(this.debugViewport)
            this.renderer.setScissor(this.debugViewport)
            this.renderer.render(this.scene, this.debugCamera)
            this.debugOverlayTexture.update({ delta, renderer: this.renderer })
            this.renderer.render(this.debugOverlay.scene, this.debugOverlay.camera)
            this.debugHelpers.forEach((h) => {
                h.visible = false
            })
        }
    }

    addHelpers(...helpers: Object3D[]) {
        helpers.forEach((h) => {
            this.registerHelper(h)
            this.scene.add(h)
        })
    }

    registerHelper(helper: Object3D) {
        helper.visible = false
        this.debugHelpers.push(helper)
    }

    setDebugMode(mode: ('game' | 'debug' | 'sideBySide')) {
        this.debugMode = mode
        this.debug = mode !== 'game'

        this.updateViewports()
    }

    setSize(width: number, height: number) {
        this.width = width
        this.height = height
        this.aspect = width / height

        this.camera.aspect = this.aspect
        this.camera.updateProjectionMatrix()

        this.debugCamera.aspect = width / height
        this.debugCamera.updateProjectionMatrix()

        this.renderer.setSize(width, height, false)

        this.updateViewports()
    }

    updateViewports() {
        if (this.debugMode === 'sideBySide') {
            this.viewport.set(0, this.height / 4, this.width / 2, this.height / 2)
            this.debugViewport.set(this.width / 2, this.height / 4, this.width / 2, this.height / 2)
        } else {
            this.viewport.set(0, 0, this.width, this.height)
            this.debugViewport.set(0, 0, this.width, this.height)
        }
    }
}
