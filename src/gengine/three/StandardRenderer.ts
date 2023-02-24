import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer,
    Object3D,
    CameraHelper,
    Vector4,
    ReinhardToneMapping,
} from 'three'
import { AxesHelper } from './AxesHelper'
import { DebugMode } from '../constants'

interface StandardRendererParams {
    canvas?: HTMLCanvasElement
    fov?: number
    aspect?: number
    near?: number
    far?: number
}

export class StandardRenderer {
    camera
    debugCamera
    renderer
    scene
    width = 0
    height = 0
    aspect = 1
    viewport = new Vector4()
    canvas: HTMLCanvasElement

    debugHelpers: Object3D[] = []
    debug = false
    debugMode: DebugMode = 'game'
    debugOrbitControls: OrbitControls
    debugViewport = new Vector4()

    constructor({
        canvas,
        fov = 60,
        aspect = 1,
        near = 0.1,
        far = 100,
    }: StandardRendererParams) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true,
        })
        this.renderer.physicallyCorrectLights = true
        this.renderer.toneMapping = ReinhardToneMapping
        this.renderer.toneMappingExposure = 2
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.outputEncoding = sRGBEncoding
        // this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setPixelRatio(1)
        this.renderer.debug.checkShaderErrors = true
        this.renderer.autoClear = false
        this.renderer.setScissorTest(true)

        this.canvas = this.renderer.domElement
        this.scene = new Scene()

        this.camera = new PerspectiveCamera(fov, aspect, near, far)
        this.camera.position.set(10, 10, 10)

        this.debugCamera = new PerspectiveCamera(fov, aspect, near, 500)
        this.debugCamera.position.set(20, 20, 20)

        this.debugOrbitControls = new OrbitControls(this.debugCamera, this.renderer.domElement)

        this.setSize(1280, 720)

        this.addHelpers(
            new AxesHelper(),
            new CameraHelper(this.camera),
        )

        this.updateViewports()
    }

    render() {
        if (this.debugMode !== 'debug') {
            this.renderer.setViewport(this.viewport)
            this.renderer.setScissor(this.viewport)
            this.renderer.render(this.scene, this.camera)
        }

        if (this.debugMode !== 'game') {
            this.debugHelpers.forEach((h) => {
                h.visible = true
            })
            this.renderer.setViewport(this.debugViewport)
            this.renderer.setScissor(this.debugViewport)
            this.renderer.render(this.scene, this.debugCamera)
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

    setDebugMode(mode: DebugMode) {
        this.debugMode = mode
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

    setCanvasContainer(element: HTMLElement) {
        element.appendChild(this.canvas)
    }

    // updateInfoDomElement(delta: number) {
    //     if (this._infoDomElement) {
    //         const { geometries, textures } = this.renderer.info.memory
    //         const { calls, triangles } = this.renderer.info.render

    //         this._infoDomElement.innerText = `${Math.floor(1 / delta)} fps
    //             ${delta * 1000} ms

    //             geometries: ${geometries}
    //             textures: ${textures}
    //             calls: ${calls}
    //             triangles: ${triangles}
    //         `
    //     }
    // }
}
