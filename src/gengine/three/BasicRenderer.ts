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
} from 'three'
import { DefaultGrid } from './DefaultGrid'
import { AxesHelper } from './AxesHelper'
import { ComponentManager } from '../ECS/ComponentManager'
import { DebugInfoTexture } from './DebugInfoTexture'
import { HUDLayer } from './HUDLayer'

export class BasicRenderer {
    camera
    debugCamera
    renderer
    scene
    grid
    debugHelpers: Object3D[] = []
    debug = false
    orbitControls?: OrbitControls
    showDebugOverlay = false
    debugOverlay
    debugOverlayTexture

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

        this.scene = new Scene()
        this.scene.background = new Color(0x161616)

        this.camera = new PerspectiveCamera(fov, aspect, near, far)
        this.camera.position.set(10, 10, 10)

        this.debugCamera = new PerspectiveCamera(fov, aspect, near, far)
        this.debugCamera.position.set(20, 20, 20)

        this.setSize(1920, 1080)

        this.grid = new DefaultGrid(32)
        this.scene.add(this.grid)

        this.debugHelpers.push(
            new AxesHelper(),
            new CameraHelper(this.camera),
        )
        this.scene.add(...this.debugHelpers)

        this.debugOverlayTexture = new DebugInfoTexture(canvas.width, canvas.height)
        this.debugOverlay = new HUDLayer(canvas.width, canvas.height, this.debugOverlayTexture)

        this.debugMode(false)
    }

    tick(delta: number, componentManager: ComponentManager) {
        this.renderer.render(this.scene, this.debug ? this.debugCamera : this.camera)

        this.jobs.forEach((job) => job(delta))

        if (this.showDebugOverlay) {
            this.debugOverlayTexture.update({ delta, renderer: this.renderer })
            this.renderer.render(this.debugOverlay.scene, this.debugOverlay.camera)
        }
    }

    addHelpers(...helpers: Object3D[]) {
        helpers.forEach((h) => {
            h.visible = this.debug
            this.debugHelpers.push(h)
            this.scene.add(h)
        })
    }

    debugMode(shouldDebug = true) {
        this.debug = shouldDebug

        this.debugHelpers.forEach((h) => {
            h.visible = shouldDebug
        })

        if (shouldDebug) {
            this.orbitControls = new OrbitControls(this.debugCamera, this.renderer.domElement)
        } else if (this.orbitControls) {
            this.orbitControls.dispose()
            this.orbitControls = undefined
        }
    }

    setSize(width: number, height: number) {
        this.renderer.setSize(width, height)
        this.renderer.domElement.style.width = 'initial'
        this.renderer.domElement.style.height = 'initial'

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.debugCamera.aspect = width / height
        this.debugCamera.updateProjectionMatrix()
    }
}
