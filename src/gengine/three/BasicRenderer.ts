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
import { DefaultGrid } from './DefaultGrid'
import { AxesHelper } from './AxesHelper'
import { DebugInfoTexture } from './DebugInfoTexture'
import { HUDLayer } from './HUDLayer'

export class BasicRenderer {
    camera
    debugCamera
    renderer
    scene
    width = 0
    height = 0
    aspect = 1
    viewport = new Vector4()

    grid

    debugHelpers: Object3D[] = []
    debug = false
    debugOrbitControls?: OrbitControls
    showDebugOverlay = false
    debugOverlay
    debugOverlayTexture
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

        this.grid = new DefaultGrid(32)
        this.scene.add(this.grid)

        this.debugOrbitControls = new OrbitControls(this.debugCamera, this.renderer.domElement)

        // this.setSize(1920, 1080)
        this.setSize(1280, 720)

        this.addHelpers(
            new AxesHelper(),
            new CameraHelper(this.camera),
        )

        this.debugOverlayTexture = new DebugInfoTexture(canvas.width, canvas.height)
        this.debugOverlay = new HUDLayer(canvas.width, canvas.height, this.debugOverlayTexture)

        this.debugMode(false)
    }

    render(delta: number) {
        this.renderer.setViewport(this.viewport)
        this.renderer.setScissor(this.viewport)
        this.renderer.render(this.scene, this.camera)

        this.jobs.forEach((job) => job(delta))

        if (this.showDebugOverlay) {
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
            h.visible = false
            this.debugHelpers.push(h)
            this.scene.add(h)
        })
    }

    debugMode(shouldDebug = true) {
        this.debug = shouldDebug
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
        if (this.debug) {
            this.viewport.set(0, this.height / 4, this.width / 2, this.height / 2)
            this.debugViewport.set(this.width / 2, this.height / 4, this.width / 2, this.height / 2)
        } else {
            this.viewport.set(0, 0, this.width, this.height)
        }
    }
}
