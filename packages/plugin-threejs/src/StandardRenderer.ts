import { AxesHelper } from 'objects/AxesHelper'
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from 'postprocessing'
import {
    CameraHelper,
    HalfFloatType,
    Object3D,
    PCFSoftShadowMap,
    PerspectiveCamera,
    ReinhardToneMapping,
    Scene,
    Vector4,
    WebGLRenderer,
} from 'three'
import { MapControls } from 'three/examples/jsm/controls/MapControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const DEBUG_CAMERA_LAYER = 1

type StandardRendererParams = {
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
    composer
    scene
    width = 0
    height = 0
    aspect = 1
    viewport = new Vector4()
    canvas: HTMLCanvasElement

    shouldRender = false
    shouldRenderDebug = false

    debugHelpers: Object3D[] = []
    debugControls: OrbitControls
    debugCanvas: HTMLCanvasElement
    debugContext: CanvasRenderingContext2D | null

    constructor({ canvas, fov = 60, aspect = 1, near = 0.1, far = 100 }: StandardRendererParams) {
        this.renderer = new WebGLRenderer({
            canvas,
            powerPreference: 'high-performance',
            antialias: false,
        })
        this.renderer.toneMapping = ReinhardToneMapping
        this.renderer.toneMappingExposure = 2
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = PCFSoftShadowMap
        this.renderer.setPixelRatio(1 /* window.devicePixelRatio */)
        this.renderer.debug.checkShaderErrors = true
        this.renderer.autoClear = false
        this.renderer.info.autoReset = false

        this.composer = new EffectComposer(this.renderer, {
            frameBufferType: HalfFloatType,
        })

        this.canvas = this.renderer.domElement
        this.scene = new Scene()

        this.camera = new PerspectiveCamera(fov, aspect, near, far)
        this.camera.position.set(10, 10, 10)

        this.debugCamera = new PerspectiveCamera(fov, aspect, near, 500)
        this.debugCamera.position.set(20, 20, 20)
        this.debugCamera.layers.enable(DEBUG_CAMERA_LAYER)
        this.debugCanvas = document.createElement('canvas')
        this.debugContext = this.debugCanvas.getContext('2d')

        this.debugControls = new MapControls(this.debugCamera, this.debugCanvas)

        this.setSize(1280, 720)

        this.addHelpers(new AxesHelper(), new CameraHelper(this.camera))

        this.composer.addPass(new RenderPass(this.scene, this.camera))
        // this.composer.addPass(new EffectPass(this.camera, new PixelationEffect(4)))
        this.composer.addPass(new EffectPass(this.camera, new BloomEffect()))
        this.composer.addPass(new EffectPass(this.camera, new SMAAEffect()))
    }

    render() {
        if (this.shouldRenderDebug) {
            this.renderer.clear()
            this.renderer.render(this.scene, this.debugCamera)

            this.debugContext?.drawImage(this.canvas, 0, 0)
        }

        if (this.shouldRender) {
            // this.renderer.render(this.scene, this.camera)
            this.composer.render()
        }
    }

    addHelpers(...helpers: Object3D[]) {
        helpers.forEach((h) => {
            this.registerHelper(h)
            this.scene.add(h)
        })
    }

    registerHelper(helper: Object3D) {
        helper.layers.set(DEBUG_CAMERA_LAYER)
        this.debugHelpers.push(helper)
    }

    setSize(width: number, height: number) {
        this.width = width
        this.height = height
        this.aspect = width / height

        this.camera.aspect = this.aspect
        this.camera.updateProjectionMatrix()

        this.debugCamera.aspect = this.aspect
        this.debugCamera.updateProjectionMatrix()
        this.debugCanvas.width = width
        this.debugCanvas.height = height

        this.renderer.setSize(width, height, false)
        this.composer.setSize(width, height)
    }

    setCanvasContainer(element: HTMLElement | null) {
        if (element) {
            element.appendChild(this.canvas)
            this.shouldRender = true
        } else {
            this.shouldRender = false
        }
    }

    setDebugCanvasContainer(element: HTMLElement | null) {
        if (element) {
            element.appendChild(this.debugCanvas)
            this.shouldRenderDebug = true
        } else {
            this.shouldRenderDebug = false
        }
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
